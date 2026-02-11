---
trigger: always_on
---

Antes de escrever qualquer linha de HTML em uma _Feature_ (página/tela), verifique a pasta `src/app/shared/ui`.

- **JÁ EXISTE?** Use o componente.
  - _Ex:_ Não crie `<button class="...">`. Use `<ui-button>`.
  - _Ex:_ Não crie `<input class="...">`. Use `<ui-input>`.
  - _Ex:_ Não crie cards com div. Use `<ui-card>` ou `<ui-metric-card>`.

## 2. A REGRA DA EXPANSÃO (CREATE FIRST)

Se você precisa de um elemento que **NÃO** existe no Design System (ex: um "Avatar", um "Tabs", um "Stepper"):

1.  **PARE** a implementação da Feature.
2.  **CRIE** o componente genérico em `src/app/shared/ui/ui-[nome]`.
    - O componente deve ser "burro" (apenas @Input/@Output).
    - O componente deve ser agnóstico ao negócio (não deve saber o que é um "Hambúrguer", apenas o que é uma "Imagem").
3.  **USE** o novo componente na Feature.

## 3. A REGRA DAS CORES SEMÂNTICAS (NO RAW COLORS)

Nunca use cores hexadecimais ou nomes de cores diretos do Tailwind (ex: `amber-500`, `stone-900`, `red-600`) em componentes novos.
Use **APENAS** os tokens semânticos definidos no `tailwind.config.js`:

- ✅ `bg-surface`, `bg-surface-card`
- ✅ `text-primary`, `text-primary-content`
- ✅ `border-surface-border`
- ✅ `text-danger`, `bg-danger-bg`
- ❌ `bg-stone-900` (PROIBIDO)
- ❌ `text-amber-500` (PROIBIDO)

## 4. EXEMPLO DE FLUXO DE PENSAMENTO

**Errado:** "Vou criar um botão de deletar aqui na tela de Pedidos."

````html
<button class="bg-red-500 text-white p-2 rounded">Deletar</button> ``` **Correto:** "Preciso de um botão de deletar. Vou usar o ui-button com variante danger." ```html <ui-button variant="danger" icon="delete" (click)="delete()">Deletar</ui-button>
````
