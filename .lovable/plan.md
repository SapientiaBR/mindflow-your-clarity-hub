
## Plano: Linkar Tarefas com Projetos, Ideias e Eventos

### Visao Geral
Permitir que ao criar ou editar uma tarefa, o usuario possa opcionalmente selecionar um projeto, ideia ou evento ao qual essa tarefa pertence. O campo `parent_id` ja existe na tabela `items` e sera usado para essa ligacao.

### Como Vai Funcionar

```text
Criar/Editar Tarefa
+-------------------------------+
| Conteudo: [______________]    |
| Prioridade: [Media v]        |
| Vinculado a: [Nenhum v]      |  <-- NOVO campo
|   - Nenhum                    |
|   - Projeto: Criar um SAAS   |
|   - Ideia: App de fitness    |
|   - Evento: Reuniao kickoff  |
| Prazo: [__/__/____]          |
+-------------------------------+
```

### Mudancas Necessarias

#### 1. Novo hook: `useParentItems` (novo arquivo)

**Arquivo:** `src/hooks/useParentItems.ts`

Um hook simples que busca todos os itens do tipo `project`, `idea` e `event` para popular o seletor. Retorna os itens agrupados por tipo.

#### 2. ItemEditModal - Adicionar seletor de vinculo

**Arquivo:** `src/components/items/ItemEditModal.tsx`

- Adicionar estado `parentId` inicializado a partir de `item.parent_id`
- Renderizar um `Select` com opcoes agrupadas (Projetos, Ideias, Eventos)
- Incluir `parent_id` no objeto `updates` ao salvar
- Mostrar o seletor apenas para tarefas (`item.type === 'task'`)

#### 3. Chat - Adicionar seletor ao criar tarefas

**Arquivo:** `src/pages/Chat.tsx`

- Quando o tipo selecionado for `task`, mostrar um seletor de vinculo ao lado do botao de tipo
- Enviar `parent_id` no `createItem` se selecionado

#### 4. Tasks.tsx - Mostrar vinculo na lista

**Arquivo:** `src/pages/Tasks.tsx`

- Buscar itens pai (projetos/ideias/eventos) para exibir o nome
- Mostrar badge com o nome do projeto/ideia/evento vinculado em cada tarefa
- Permitir filtrar tarefas por projeto

#### 5. Tipos - Atualizar interface

**Arquivo:** `src/types/index.ts`

- Garantir que `parent_id` aceita `string | null` para limpar vinculos

#### 6. useItems - Incluir parent_id no createItem

**Arquivo:** `src/hooks/useItems.tsx`

- Ja suporta `parent_id` no `createItem`, apenas garantir que funciona com `null`

---

### Detalhes Tecnicos

#### Hook useParentItems

```typescript
// Busca projetos, ideias e eventos para usar como opcoes de vinculo
export function useParentItems() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['items', 'parents'],
    queryFn: async () => {
      const { data } = await supabase
        .from('items')
        .select('id, type, content, title')
        .in('type', ['project', 'idea', 'event'])
        .neq('status', 'completed');
      return data;
    },
    enabled: !!user,
  });
}
```

#### Seletor no ItemEditModal

O seletor tera opcoes agrupadas:

```text
[Selecionar vinculo (opcional)]
--- Projetos ---
  Criar um SAAS
  App de Receitas
--- Ideias ---
  Sistema de gamificacao
--- Eventos ---
  Reuniao de kickoff
```

Usando `SelectGroup` + `SelectLabel` do Radix UI para agrupar visualmente.

#### Exibicao na lista de tarefas

Cada tarefa vinculada mostrara um badge pequeno:

```text
[x] Configurar banco de dados
    [Projeto: Criar um SAAS]  [Alta]  [Prazo: 15 Mar]
```

---

### Resumo dos Arquivos

| Arquivo | Mudanca |
|---------|---------|
| `src/hooks/useParentItems.ts` | **Novo** - Hook para buscar projetos/ideias/eventos |
| `src/types/index.ts` | Ajustar `parent_id` para aceitar `null` |
| `src/components/items/ItemEditModal.tsx` | Adicionar seletor de vinculo para tarefas |
| `src/pages/Chat.tsx` | Adicionar seletor de vinculo ao criar tarefas |
| `src/pages/Tasks.tsx` | Mostrar badge do item vinculado na lista |
| `src/hooks/useItems.tsx` | Garantir suporte a `parent_id: null` |

### Resultado Esperado

1. Ao criar tarefa no Chat, opcao de vincular a projeto/ideia/evento
2. Ao editar tarefa, poder mudar ou remover o vinculo
3. Na lista de tarefas, ver claramente a qual projeto pertence
4. Campo totalmente opcional - tarefas sem vinculo continuam funcionando normalmente
