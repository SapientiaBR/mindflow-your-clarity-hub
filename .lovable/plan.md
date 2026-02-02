
## Plano de Correção: Varredura Completa do Site

### Problema Identificado

Ao analisar o fluxo de atualização dos cards, identifiquei que o problema de "updates que não salvam" está relacionado à **falta de feedback visual imediato e possíveis erros silenciosos** nas mutações do React Query.

### Diagnóstico Detalhado

#### 1. Problema Principal: Mutação sem Feedback de Erro

No arquivo `src/hooks/useItems.tsx`, a função `updateItem` não tem tratamento de erro no callback:

```typescript
const updateItem = useMutation({
  mutationFn: async ({ id, ...updates }) => {
    const { data, error } = await supabase.from('items').update(updates).eq('id', id).select().single();
    if (error) throw error;  // Erro é lançado, mas...
    return mapDatabaseItem(data);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['items'] });
    // Sem toast de sucesso!
  },
  // FALTA: onError callback!
});
```

#### 2. Problema Secundário: ItemEditModal não mostra erros

No `ItemEditModal.tsx`, o `handleSave` chama `onSave(item.id, updates)` e fecha imediatamente:

```typescript
const handleSave = () => {
  // ... monta updates
  onSave(item.id, updates);
  onClose();  // Fecha ANTES de saber se salvou!
};
```

#### 3. Problema com undefined values

No `ItemEditModal.tsx`, ao definir `updates.due_date = undefined` ou `updates.reminder_at = undefined`, o Supabase pode não processar corretamente. Deve-se usar `null` para limpar campos.

---

### Correções Necessárias

#### 1. Adicionar tratamento de erros e feedback no useItems.tsx

**Arquivo:** `src/hooks/useItems.tsx`

- Adicionar `onError` callback em todas as mutações
- Adicionar `onSuccess` com toast de confirmação
- Retornar a Promise para permitir await

```typescript
const updateItem = useMutation({
  mutationFn: async ({ id, ...updates }) => {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDatabaseItem(data);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['items'] });
  },
  onError: (error) => {
    console.error('Erro ao atualizar item:', error);
  },
});
```

#### 2. Corrigir ItemEditModal para usar null em vez de undefined

**Arquivo:** `src/components/items/ItemEditModal.tsx`

```typescript
// De:
updates.due_date = undefined;

// Para:
updates.due_date = null;
```

#### 3. Adicionar feedback visual nas páginas

**Arquivos:** `src/pages/Tasks.tsx`, `src/pages/Ideas.tsx`, `src/pages/Events.tsx`, `src/pages/Goals.tsx`, `src/pages/Projects.tsx`, `src/pages/Timeline.tsx`

Modificar `handleSave` para mostrar toast de sucesso/erro:

```typescript
const handleSave = async (id: string, updates: Partial<Item>) => {
  try {
    await updateItem.mutateAsync({ id, ...updates });
    toast({
      title: "Salvo com sucesso!",
      description: "As alterações foram aplicadas.",
    });
  } catch (error) {
    toast({
      title: "Erro ao salvar",
      description: "Tente novamente.",
      variant: "destructive",
    });
  }
};
```

#### 4. Corrigir tipagem do Item para aceitar null

**Arquivo:** `src/types/index.ts`

Atualizar interface para aceitar `null`:

```typescript
export interface Item {
  // ...
  due_date?: string | null;
  reminder_at?: string | null;
  // ...
}
```

#### 5. Invalidar todas as queries relacionadas

**Arquivo:** `src/hooks/useItems.tsx`

Garantir que todas as queries são invalidadas após mutações:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['items'] });
  queryClient.invalidateQueries({ queryKey: ['items', 'upcoming-tasks'] });
  queryClient.invalidateQueries({ queryKey: ['items', 'important'] });
  queryClient.invalidateQueries({ queryKey: ['items', 'goals'] });
  queryClient.invalidateQueries({ queryKey: ['items', 'events'] });
};
```

---

### Resumo dos Arquivos a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `src/hooks/useItems.tsx` | Adicionar onError, melhorar invalidateQueries |
| `src/types/index.ts` | Aceitar null em due_date e reminder_at |
| `src/components/items/ItemEditModal.tsx` | Usar null em vez de undefined, não fechar modal imediatamente |
| `src/pages/Tasks.tsx` | Adicionar toast no handleSave com try/catch |
| `src/pages/Ideas.tsx` | Adicionar toast no handleSave com try/catch |
| `src/pages/Events.tsx` | Adicionar toast no handleSave com try/catch |
| `src/pages/Goals.tsx` | Adicionar toast no handleSave com try/catch |
| `src/pages/Projects.tsx` | Adicionar toast no handleSave com try/catch |
| `src/pages/Timeline.tsx` | Adicionar toast no handleSave com try/catch |

---

### Resultado Esperado

1. **Feedback imediato** - Toast de sucesso/erro após cada operação
2. **Erros visíveis** - Console logs e toasts para qualquer falha
3. **Dados sincronizados** - Invalidação correta de todas as queries
4. **Campos nulos** - Valores undefined convertidos para null no banco
5. **Modal mais robusto** - Não fecha até confirmar que salvou

---

### Detalhes Técnicos

**Fluxo atual (com problema):**
1. Usuário edita item no modal
2. Clica em "Salvar"
3. Modal fecha imediatamente
4. Mutação executa em background
5. Se falhar, usuário não vê erro
6. Dados parecem "não salvos"

**Fluxo corrigido:**
1. Usuário edita item no modal
2. Clica em "Salvar"
3. Mutação executa com loading state
4. Se sucesso: Modal fecha + Toast verde
5. Se erro: Modal permanece + Toast vermelho
6. Queries são invalidadas para atualizar UI
