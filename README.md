# 💰 Gestionnaire de Transactions Financières

Application web moderne de gestion de finances personnelles développée avec Next.js 16 et Django REST Framework.

## 🚀 Fonctionnalités

- ✅ Suivi du solde en temps réel
- ✅ Gestion des revenus et dépenses
- ✅ Visualisation des ratios dépenses/revenus
- ✅ Ajout, suppression et affichage des transactions
- ✅ Interface responsive (mobile, tablette, desktop)
- ✅ Notifications toast pour les actions utilisateur
- ✅ Design moderne avec DaisyUI et Tailwind CSS

## 🛠️ Technologies Utilisées

### Frontend

- **Next.js 16.1.6** - Framework React avec App Router
- **React 19.2.3** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS 4.1.18** - Framework CSS utility-first
- **DaisyUI 5.5.18** - Composants UI pour Tailwind
- **Axios 1.13.5** - Client HTTP
- **Lucide React** - Icônes modernes
- **React Hot Toast** - Notifications toast

### Backend

- **Django REST Framework** - API REST

## 📋 Prérequis

- Node.js 20.x ou supérieur
- Python 3.10 ou supérieur
- npm ou yarn
- pip (gestionnaire de packages Python)

## 🔧 Installation

### Configuration du Backend (Django)

```bash
# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows
venv\Scripts\activate
# Sur Mac/Linux
source venv/bin/activate

# Installer les dépendances
pip install django djangorestframework django-cors-headers

# Appliquer les migrations
python manage.py migrate

# Lancer le serveur de développement
python manage.py runserver
```

Le backend sera accessible sur `http://localhost:8000`

### Configuration du Frontend (Next.js)

```bash
# Installer les dépendances
npm install
# ou
yarn install

# Lancer le serveur de développement
npm run dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:3000`

````

## 🔌 Configuration de l'API

Créer un fichier `api.ts` dans votre dossier `app/` :

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // URL de votre API Django
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
````

## 🎨 Personnalisation

### Modifier le thème DaisyUI

Dans `tailwind.config.js` :

```javascript
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // Choisir vos thèmes
  },
};
```

## 📊 Modèle de Données (Backend)

### Transaction Model (Django)

```python
from django.db import models

class Transaction(models.Model):
    text = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
```

### API Endpoints

- `GET /api/transactions/` - Récupérer toutes les transactions
- `POST /api/transactions/` - Créer une nouvelle transaction
- `DELETE /api/transactions/{id}/` - Supprimer une transaction

<!-- nouveau-pc:debut -->
## Installer sur un nouveau PC

**Prérequis :** Git, Python 3.12 et Node.js 20 ou plus.

```bash
git clone git@github.com:Magloireaffokpe/Application-de-Gestion-des-Finances.git
cd Application-de-Gestion-des-Finances/Backend
python3 -m venv env
source env/bin/activate   # Windows : env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Dans un autre terminal
cd frontend
npm install
echo 'NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/' > .env   # la barre finale est nécessaire
npm run dev
```

**À recopier à la main (hors Git) :** `Backend/db.sqlite3` pour conserver les données, et `frontend/.env`.
<!-- nouveau-pc:fin -->
