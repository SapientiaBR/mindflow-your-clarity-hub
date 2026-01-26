

## Plano: Dashboard com Fundo Branco e Cards Auto-Ajustáveis

### Visão Geral
Vamos fazer duas alterações principais na Dashboard:
1. Trocar o fundo escuro por branco para destacar os cards coloridos
2. Ajustar o layout para que todos os cards sejam visíveis sem rolagem, adaptando-se ao tamanho da tela

---

### 1. Fundo Branco na Dashboard

**Arquivo:** `src/pages/Dashboard.tsx`

Vamos remover os backgrounds animados (partículas e grid) e aplicar um fundo branco/claro limpo que destaque os cards coloridos.

**Mudanças:**
- Remover `<TechGridBackground />` e `<ParticleBackground />`
- Substituir o gradiente escuro por um fundo branco com um sutil gradiente para manter elegância

```text
De:
┌─────────────────────────────────────────┐
│  Fixed backgrounds (gradiente escuro)   │
│  + TechGridBackground                   │
│  + ParticleBackground                   │
└─────────────────────────────────────────┘

Para:
┌─────────────────────────────────────────┐
│  Fundo branco/cinza claro               │
│  (sem animações de partículas)          │
└─────────────────────────────────────────┘
```

---

### 2. Cards Auto-Ajustáveis (Sem Scroll)

**Arquivos a modificar:**
- `src/pages/Dashboard.tsx` - Layout principal
- `src/components/dashboard/DashboardCard.tsx` - Estilo dos cards
- Cards individuais (Tasks, Ideas, Projects, Events, Notes) - Limitar itens exibidos

**Estratégia:**

#### 2.1 Layout Principal - Grid Responsivo com `minmax` e `fr`

Usar CSS Grid com alturas flexíveis baseadas no viewport:

```css
/* Desktop: 3 colunas, altura máxima calculada */
grid-template-rows: auto auto minmax(0, 1fr);

/* Com altura máxima do container baseada na viewport */
max-height: calc(100vh - [header + goals + stats]);
```

#### 2.2 Limitar Conteúdo dos Cards

Cada card mostrará menos itens para caber sem scroll:

| Card | Itens Atuais | Itens Novos |
|------|--------------|-------------|
| Tasks | 4 | 2-3 |
| Ideas | 3 | 2-3 |
| Projects | 4 | 2-3 |
| Events | 5 próximos | 2-3 próximos |
| Notes | 6 | 4 |

#### 2.3 Container Principal com Altura Fixa

```text
┌─────────────────────────────────────────────────────────┐
│ Header (Dashboard + Resetar Layout)                     │  ~40px
├─────────────────────────────────────────────────────────┤
│ GoalsBar                                                │  ~80px
├─────────────────────────────────────────────────────────┤
│ Stats Row (4 cards pequenos)                            │  ~100px
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┬─────────────┬─────────────┐             │
│ │   Tasks     │   Ideas     │   Events    │             │  Resto do
│ │   (card)    │   (card)    │ (calendar)  │             │  viewport
│ ├─────────────┼─────────────┼─────────────┤             │
│ │  Projects   │   Notes     │             │             │
│ │   (card)    │  (mural)    │             │             │
│ └─────────────┴─────────────┴─────────────┘             │
└─────────────────────────────────────────────────────────┘
```

---

### 3. Detalhes Técnicos

#### 3.1 Dashboard.tsx - Novo Layout

```typescript
// Remover backgrounds animados
// De:
<div className="fixed inset-0 pointer-events-none z-0">
  <TechGridBackground />
</div>
<div className="fixed inset-0 pointer-events-none z-0">
  <ParticleBackground />
</div>

// Para:
<div className="fixed inset-0 bg-gray-50 pointer-events-none z-0" />
```

```typescript
// Container principal com altura do viewport
<div className="relative z-10 p-4 md:p-6 h-[calc(100vh-2rem)] flex flex-col">
  {/* Header */}
  <header className="shrink-0">...</header>
  
  {/* Goals */}
  <GoalsBar className="shrink-0" />
  
  {/* Stats */}
  <div className="shrink-0 grid grid-cols-4 gap-4">...</div>
  
  {/* Cards - Preenche o resto */}
  <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Cards com overflow hidden */}
  </div>
</div>
```

#### 3.2 Cards Individuais - Altura Máxima

Cada card terá `max-h-full` e `overflow-hidden` para não expandir além do espaço disponível.

#### 3.3 Ajustes nos Cards de Conteúdo

**TasksCard.tsx:**
```typescript
// Mostrar apenas 2-3 tarefas
tasks.slice(0, 3).map(...)
```

**EventsCalendarCard.tsx:**
```typescript
// Calendário compacto + apenas 2 próximos eventos
upcomingEvents.slice(0, 2).map(...)
```

---

### 4. Adaptação para Cards com Cores

Com fundo branco, os cards coloridos ficarão muito mais destacados. Pequenos ajustes de contraste:

**DashboardCard.tsx:**
- Adicionar sombra mais pronunciada para "flutuar" sobre o fundo branco
- Bordas mais definidas

```typescript
className={`
  bg-gradient-to-br ${gradientClasses[gradient]}
  shadow-lg hover:shadow-xl  // Mais sombra
  border border-gray-200/50  // Borda visível no branco
`}
```

---

### 5. Resumo dos Arquivos a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `src/pages/Dashboard.tsx` | Remover backgrounds, aplicar fundo branco, layout flex com altura fixa |
| `src/components/dashboard/DashboardCard.tsx` | Adicionar sombras para contraste no fundo branco |
| `src/components/dashboard/TasksCard.tsx` | Limitar para 3 tarefas |
| `src/components/dashboard/IdeasCard.tsx` | Limitar para 3 ideias |
| `src/components/dashboard/ProjectsCard.tsx` | Limitar para 3 projetos |
| `src/components/dashboard/EventsCalendarCard.tsx` | Layout compacto, 2 eventos |
| `src/components/dashboard/QuickNotesBoard.tsx` | Limitar para 4 notas |
| `src/components/dashboard/StatCard.tsx` | Ajustar cores para fundo claro |
| `src/components/dashboard/GoalsBar.tsx` | Ajustar cores para fundo claro |

---

### 6. Resultado Esperado

1. **Fundo branco limpo** - Sem animações de partículas, visual mais clean
2. **Cards coloridos destacados** - Sombras e bordas realçam cada card
3. **Tudo visível na tela** - Sem necessidade de scroll vertical
4. **Layout responsivo** - Adapta-se a diferentes tamanhos de tela

