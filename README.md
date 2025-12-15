# 🛢️ PetroAnalytics

Sistema de monitoramento e análise do mercado de combustíveis desenvolvido para o Ministério dos Transportes. A plataforma permite coletar, armazenar e visualizar dados sobre vendas e preços de combustíveis de postos de gasolina em diversas regiões do Brasil.

## 📋 Sobre o Projeto

O PetroAnalytics foi desenvolvido como solução fullstack para consolidar dados brutos de postos de gasolina e transformá-los em informação gerencial útil. O sistema permite que gestores acompanhem o comportamento dos preços e do consumo de combustíveis ao longo do tempo através de dashboards interativos e relatórios detalhados.

### Funcionalidades Principais

- 📊 **Dashboard Gerencial**: Visualização consolidada de dados com KPIs e gráficos
- 🔍 **Filtros Avançados**: Filtrar dados por combustível, cidade e tipo de veículo
- 📈 **KPIs em Tempo Real**: Média de preços e volume consumido por categoria
- 👤 **Relatório de Motoristas**: Histórico de abastecimento por CPF/Nome
- 🎲 **Geração de Dados**: Script automatizado para popular o banco com dados fictícios
- 🔐 **Autenticação Segura**: Sistema de login com JWT tokens

## 🚀 Tecnologias Utilizadas

### Backend
- **Python 3.11+**: Linguagem de programação
- **FastAPI**: Framework web moderno e performático
- **SQLAlchemy**: ORM para manipulação do banco de dados
- **Pydantic**: Validação de dados e schemas
- **Alembic**: Gerenciamento de migrations do banco
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação baseada em tokens

### Frontend
- **Angular 21**: Framework frontend
- **TypeScript**: Superset do JavaScript com tipagem estática
- **NG Prime**: Biblioteca de componentes UI
- **Chart.js / ApexCharts**: Biblioteca para gráficos interativos
- **RxJS**: Programação reativa

### Infraestrutura
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de containers
- **Vercel**: Plataforma de deploy (frontend)

## 📦 Estrutura do Projeto

```
PetroAnalytics/
├── backend/
│   ├── alembic/              # Migrations do banco de dados
│   ├── app/
│   │   ├── core/             # Configurações centrais
│   │   ├── models/           # Modelos SQLAlchemy
│   │   ├── schemas/          # Schemas Pydantic
│   │   ├── routers/          # Rotas da API
│   │   ├── services/         # Lógica de negócio
│   │   ├── dependencies/     # Injeção de dependências
│   │   ├── utils/            # Funções auxiliares
│   │   └── seeds/            # Scripts de geração de dados
│   ├── tests/                # Testes automatizados
│   ├── dockerfile            # Imagem Docker do backend
│   └── requirements.txt      # Dependências Python
├── frontend/
│   ├── src/
│   │   ├── app/              # Componentes Angular
│   │   ├── assets/           # Recursos estáticos
│   │   └── environments/     # Configurações de ambiente
│   ├── dockerfile            # Imagem Docker do frontend
│   └── package.json          # Dependências Node.js
└── docker-compose.yml        # Configuração de orquestração
```

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0 ou superior)
- [Git](https://git-scm.com/) (para clonar o repositório)

## 🏃 Executando Localmente

### 1. Clone o Repositório

```
git clone https://github.com/LucasLuis-Dev/PetroAnalytics.git
cd PetroAnalytics
```

### 2. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e ajuste as configurações conforme necessário:

```
cd backend
cp .env.example .env
```

Edite o arquivo `.env` do backend com suas configurações:

```
# Database
DATABASE_URL=postgresql+psycopg://petroanalytics_owner:petro123@postgres:5432/petroanalyticsdb

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:4200,
PROJECT_NAME=PetroAnalytics
VERSION=1.0
REDIS_URL=redis://redis:6379
ENABLE_REDIS=True

# JWT Configuration
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Seed Configuration (IMPORTANTE)
SEED_EMAIL=usuario@exemplo.com
SEED_PASSWORD=senha-segura-123
```

> ⚠️ **IMPORTANTE**: As variáveis `SEED_EMAIL` e `SEED_PASSWORD` são obrigatórias para executar o script de seed, pois a API possui proteção de autenticação e somente usuários logados podem inserir dados.



Edite o arquivo `.env` na raiz do projeto com suas configurações:

```
POSTGRES_USER=petroanalytics_owner
POSTGRES_PASSWORD=petro123
POSTGRES_DB=petroanalyticsdb
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:4200
REDIS_URL=redis://redis:6379
```


### 3. Inicie os Containers com Docker Compose

Na raiz do projeto, execute:

```
docker-compose up --build -d
```

Este comando irá:
- 🐳 Construir as imagens Docker do backend e frontend
- 🚀 Iniciar os containers em modo detached (background)
- 🗄️ Criar e configurar o banco de dados PostgreSQL
- ⚡ Expor as aplicações nas portas configuradas

**Aguarde alguns instantes** para que todos os serviços inicializem completamente.

### 4. Execute as Migrations do Banco de Dados

```
docker-compose exec backend alembic upgrade head
```

### 5. Registre um Usuário na Plataforma

Antes de executar o script de seed, é necessário criar um usuário no sistema. Você tem duas opções:

#### Opção A: Via Interface Web

1. Acesse [http://localhost:4200](http://localhost:4200)
2. Clique em **"Registrar"** ou **"Criar Conta"**
3. Preencha o formulário com as mesmas credenciais configuradas no `.env`:
   - Email: `usuario@exemplo.com` (ou o email que você definiu em `SEED_EMAIL`)
   - Senha: `senha-segura-123` (ou a senha que você definiu em `SEED_PASSWORD`)
4. Confirme o cadastro

#### Opção B: Via API (curl)

```
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha-segura-123",
    "name": "Usuário Teste"
  }'
```

### 6. Popule o Banco com Dados Fictícios

Agora que você possui um usuário registrado, execute o script de seed:

```
docker-compose exec backend python -m app.seeds.fuel_record_seed
```

**Como funciona:**
1. O script lê as credenciais `SEED_EMAIL` e `SEED_PASSWORD` do arquivo `.env`
2. Realiza login na API para obter um token JWT válido
3. Utiliza o token para autenticar as requisições de inserção de dados
4. Gera e registra dados fictícios no banco de dados

Este script irá gerar:
- 🏢 Postos de gasolina em diversas cidades brasileiras
- ⛽ Registros de abastecimento com dados realistas
- 🚗 Motoristas e veículos variados
- 📊 Dados de preços e volumes consistentes

> 💡 **Dica**: Caso receba erro de autenticação, verifique se as credenciais no `.env` correspondem exatamente ao usuário registrado.

### 7. Acesse a Aplicação

Após a inicialização completa:

- **Frontend (Dashboard)**: [http://localhost:4200](http://localhost:4200)
- **API Backend**: [http://localhost:8000](http://localhost:8000)
- **Documentação da API (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

Faça login com as credenciais configuradas para acessar o dashboard completo.

## 🌐 Deploy Online

A aplicação está disponível em produção:

- **Frontend (Dashboard)**: [https://petro-analytics.vercel.app/](https://petro-analytics.vercel.app/)

O frontend em produção consome uma API backend também deployada e configurada para demonstração. Você pode criar uma conta diretamente na plataforma online e explorar todas as funcionalidades.

## 📚 Documentação da API

A API REST disponibiliza os seguintes endpoints principais:

### Autenticação
- `POST /api/auth/register`: Registrar novo usuário
- `POST /api/auth/login`: Realizar login e obter token JWT

### Ingestão de Dados (Requer Autenticação)
- `POST /api/fuel-records`: Registrar novo abastecimento

### Consultas e Dashboard (Requer Autenticação)
- `GET /api/fuel-records`: Listar abastecimentos (com paginação)
- `GET /api/kpis/average-price`: Média de preços por combustível
- `GET /api/kpis/volume-by-vehicle`: Volume consumido por tipo de veículo
- `GET /api/drivers/history`: Histórico de abastecimento por motorista

**Autenticação**: Todos os endpoints (exceto registro e login) requerem token JWT no header:

```
Authorization: Bearer <seu-token-jwt>
```

Acesse a documentação interativa completa em: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🧪 Executando Testes

Para executar a suíte de testes do backend:

```
docker-compose exec backend pytest
```

Para testes com cobertura de código:

```
docker-compose exec backend pytest --cov=app --cov-report=html
```

Ver relatório de cobertura:

```
open backend/htmlcov/index.html
```

Executar testes específicos:

```
docker-compose exec backend pytest tests/test_services.py -v
```

## 🛠️ Comandos Úteis do Docker

### Gerenciamento de Containers

```
# Ver logs dos containers
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Parar os containers
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados do banco)
docker-compose down -v

# Reiniciar um serviço específico
docker-compose restart backend

# Verificar status dos containers
docker-compose ps
```

### Acesso aos Containers

```
# Acessar o shell do container backend
docker-compose exec backend bash

# Acessar o shell do container frontend
docker-compose exec frontend sh

# Acessar o PostgreSQL
docker-compose exec db psql -U postgres -d petroanalytics
```

### Rebuild e Limpeza

```
# Rebuild sem cache
docker-compose build --no-cache

# Remover imagens não utilizadas
docker image prune -a

# Limpar todo o sistema Docker (CUIDADO)
docker system prune -a --volumes
```

## 🔄 Workflow de Desenvolvimento

### Backend

```
# Criar nova migration
docker-compose exec backend alembic revision --autogenerate -m "Descrição da mudança"

# Aplicar migrations
docker-compose exec backend alembic upgrade head

# Reverter última migration
docker-compose exec backend alembic downgrade -1

# Ver histórico de migrations
docker-compose exec backend alembic history

# Acessar Python shell
docker-compose exec backend python

# Instalar nova dependência
docker-compose exec backend pip install nome-pacote
# Não esqueça de atualizar o requirements.txt
docker-compose exec backend pip freeze > requirements.txt
```

### Frontend

```
# Instalar novas dependências
cd frontend
npm install <pacote>

# Gerar novo componente
ng generate component components/nome-componente

# Gerar novo serviço
ng generate service services/nome-servico

# Rebuild do container frontend
docker-compose up -d --build frontend

# Atualizar dependências
npm update
```

## 📊 Modelo de Dados

### Entidades Principais

#### User (Usuário)
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `name`: String
- `hashed_password`: String
- `is_active`: Boolean
- `created_at`: DateTime

#### FuelRecord (Registro de Abastecimento)
- `id`: UUID (Primary Key)
- `station_id`: String (Identificador do Posto - CNPJ)
- `station_name`: String (Nome do Posto)
- `city`: String (Cidade)
- `state`: String (Estado - UF)
- `collection_date`: DateTime (Data da Coleta)
- `fuel_type`: Enum (Gasolina, Etanol, Diesel S10)
- `sale_price`: Decimal (Preço de Venda R$/litro)
- `volume_sold`: Decimal (Volume Vendido em litros)
- `driver_name`: String (Nome do Motorista)
- `driver_cpf`: String (CPF do Motorista)
- `vehicle_plate`: String (Placa do Veículo)
- `vehicle_type`: Enum (Carro, Moto, Caminhão Leve, Carreta, Ônibus)
- `created_at`: DateTime


## 🔐 Segurança

### Boas Práticas Implementadas

- ✅ Senhas hasheadas com bcrypt
- ✅ Autenticação JWT com expiração configurável
- ✅ Validação de dados com Pydantic
- ✅ Proteção contra SQL Injection (ORM)
- ✅ CORS configurado adequadamente
- ✅ Variáveis sensíveis em arquivo `.env`
- ✅ CPF mascarado na exibição frontend


## 🐛 Troubleshooting

### Problema: Containers não iniciam

```
# Verificar logs
docker-compose logs

# Remover containers e volumes
docker-compose down -v

# Rebuild completo
docker-compose up --build
```

### Problema: Erro ao executar seed

```
# Verificar se o backend está rodando
docker-compose ps

# Verificar se as migrations foram aplicadas
docker-compose exec backend alembic current

# Verificar logs do backend
docker-compose logs backend

# Confirmar que SEED_EMAIL e SEED_PASSWORD estão corretos no .env
docker-compose exec backend cat /app/.env | grep SEED
```

### Problema: Frontend não conecta ao backend

```
# Verificar se o backend está acessível
curl http://localhost:8000/health

# Verificar configuração de CORS no backend
docker-compose logs backend | grep CORS

# Verificar variável de ambiente do frontend
docker-compose exec frontend cat /usr/share/nginx/html/environment.js
```

### Problema: Banco de dados não responde

```
# Verificar status do PostgreSQL
docker-compose exec db pg_isready

# Acessar e verificar banco
docker-compose exec db psql -U postgres -d petroanalytics -c "\dt"

# Resetar banco (CUIDADO: apaga todos os dados)
docker-compose down -v
docker-compose up -d db
docker-compose exec backend alembic upgrade head
```

### Padrão de Commits

Foi seguido o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Formatação de código
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Manutenção geral

## 📝 Licença

Este projeto foi desenvolvido como teste técnico para a V-Lab e está disponível para fins educacionais.

## 👨‍💻 Autor

**Lucas Luis**
- GitHub: [@LucasLuis-Dev](https://github.com/LucasLuis-Dev)
- LinkedIn: [Lucas Luis](https://www.linkedin.com/in/lucasluis-dev/)
- Email: lucasluisouza@gmail.com

## 🙏 Agradecimentos

- V-Lab pela oportunidade do desafio técnico
- Todos que contribuíram com feedback e sugestões

---