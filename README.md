# Divina Navegação — Divina Terra × 75LAB

Apresentação comercial em HTML da **75LAB** para a **Divina Terra — Healthy Market**.
Divina Navegação: sistema proprietário de organização, navegação e execução de loja para a rede de franquias.

🔗 **https://projetos.75lab.com.br/divina-terra-guia-essencial/**

## Como navegar
- `←` `→` · espaço · scroll · swipe no celular · rodapé Começo / Meio / Fim clicável
- `M` abre o índice · `Esc` fecha
- Botão **Baixar PDF** na última tela (1 tela por página, 1600×900)

## Estrutura — um layout diferente por tela
| # | Tela | Formato |
|---|---|---|
| 1 | Capa | Título + órbita dos 6 movimentos em volta do símbolo da marca |
| 2 | O desafio | Comparador antes × depois arrastável (gôndola por marca × por necessidade) com os 4 problemas |
| 3 | O sistema | Roda clicável dos 7 componentes, entre "Não é" e "É" |
| 4 | Divina Logic | Simulador de gôndola de 1 a 4+ módulos + regras Obrigatório/Adaptável/Recomendado |
| 5 | Metodologia | Escada de 7 fases (10 etapas) com entregáveis e aprovação por fase |
| 6 | Piloto e escala | Ondas concêntricas, critério de aprovação, clusters P/M/G e checklist marcável |
| 7 | Papéis e governança | Matriz quem faz o quê — no projeto e na rede — e fluxo do novo SKU |
| 8 | Entregáveis | 9 produtos como embalagens na prateleira + 6 serviços como tíquetes |
| 9 | Investimento | Etiqueta de gôndola com R$ 29.900 + cupom "você leva / não está incluído" |
| 10 | Próximo passo | Manifesto + caminho de 4 passos marcáveis e indicadores operacionais |

Fonte do conteúdo: *Divina Terra — Estratégia Completa de Organização, Navegação e Execução de Loja* (docx, 15/09/2026).

## Como editar
O `index.html` é gerado. Edite os arquivos em `src/` e rode:

```bash
python3 build.py
```

- `src/slides.html` — marcação das telas
- `src/style.css` — estilos (palco fixo 1600×900, uma seção por tela)
- `src/script.js` — dados (fases, produtos, serviços…) e interações
- `build.py` — junta tudo e embute o logo da Divina Terra (âmbar, terra e o símbolo recortado) a partir de `dt-logo.png`

## Identidade visual
| Cor | Hex |
|---|---|
| Âmbar (campanha) | `#DE9835` |
| Marrom terra | `#473225` |
| Verde mata | `#133F2E` |
| Areia | `#D1CBB8` |
| Creme | `#F5F0E4` |

Padrão de pétalas, anéis concêntricos, ícones lineares, títulos em caixa alta com uma palavra em destaque.
Cores sólidas, sem contornos. Tipografia: Jost + Cormorant Garamond.

---
75LAB · Setembro de 2026
