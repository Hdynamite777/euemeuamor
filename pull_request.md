# Pull Request: fix/add-images → main

Este PR restaura os arquivos extraídos do arquivo files.zip, adiciona placeholders temporários para imagens (evitar ícones de imagem quebrada) e prepara o repo para inclusão das imagens reais.

O que foi feito:
- Adiciona index.html, styles.css, script.js na branch fix/add-images.
- Substitui referências a imagens por placeholders seguros.

Próximo passo sugerido:
- Mesclar este PR para `main` para que o site passe a usar a versão restaurada.
- Opcional: extrair as imagens originais de files.zip e adicioná-las em `images/` (renomeando para nomes seguros), atualizar referências no HTML e criar novo commit.
