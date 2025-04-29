# 📄 README - ApiResponse Standard Professionnel

## Objectif

Ce module définit un système de réponses API uniformisé, typé et enrichi pour ExpressJS, inspiré des bonnes pratiques utilisées par les grandes entreprises (Stripe, Twilio, GitHub).

---

## Structure d'un ApiResponse

Toutes les réponses envoyées suivent une structure cohérente :

```json
{
  "statusCode": "10000",
  "message": "Opération réussie",
  "meta": {
    "timestamp": "2025-04-28T13:45:30.123Z",
    "path": "/api/v1/user/login",
    "processingTimeMs": 123,
    "traceId": "abc123xyz789"
  },
  "data": {
    // Données spécifiques à l'opération
  }
}
```

---

## Fichiers principaux

### 1. Enums

```ts
enum StatusCode {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
}
```
- **Pourquoi ?** : Séparer les codes métiers (succès/échec) des codes HTTP pour plus de flexibilité métier.

```ts
enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}
```
- **Pourquoi ?** : Utiliser les bons standards HTTP (RFC 7231).

---

### 2. Métadonnées automatiques (`meta`)

```ts
interface MetaData {
  timestamp: string;
  path: string;
  processingTimeMs?: number;
  traceId?: string;
}
```
- **timestamp** : Horodatage ISO 8601 → permet de **suivre quand** la requête a été traitée.
- **path** : URL appelée → **utile pour les logs** ou la traçabilité.
- **processingTimeMs** *(optionnel)* : Mesure du temps de traitement → **permet de monitorer les performances**.
- **traceId** *(optionnel)* : ID unique pour suivre une requête de bout en bout → **essentiel dans les architectures distribuées** (ex: microservices).

---

### 3. Classe `ApiResponse`

```ts
abstract class ApiResponse<T = any> { ... }
```

- **Statique, Typée, Flexible** :
  - `T` permet de typer les `data` (exemple : `UserData`, `ProductInfo`, etc).
  - Sécurité TypeScript sans perte d'information.

- **Principales méthodes** :
  - `prepare()`: prépare la réponse HTTP (ajout d’en-têtes et construction du JSON).
  - `send()`: interface publique pour envoyer la réponse.
  - `sanitize()`: construit le corps de la réponse en **filtrant les champs internes**.

- **Conventions internes** :
  - Ne jamais exposer `status` (HTTP) directement au client.
  - Tous les champs du corps sont strictement utiles pour le client.

---

### 4. Sous-classes concrètes

```ts
class SuccessResponse<T> extends ApiResponse<T> { ... }
class FailureResponse extends ApiResponse { ... }
class AuthFailureResponse extends ApiResponse { ... }
```

➡️ Facilite l'utilisation au quotidien :

```ts
new SuccessResponse('Connexion réussie', { token: 'abcd' }).send(res, req);
```

---

## Justifications des informations supplémentaires

| Élément ajouté | Utilité principale |
|:--|:--|
| **timestamp** | Tracer les requêtes, analyser l'ordre des opérations. |
| **path** | Identifier rapidement quelle route a échoué ou réussi. |
| **processingTimeMs** | Optimiser les performances, détecter les ralentissements. |
| **traceId** | Suivre une requête dans tout un système distribué (ex : microservices). |

➡️ Toutes ces informations permettent de faire du **monitoring sérieux**, du **debug rapide**, et du **suivi en production** de façon professionnelle.

---

# 🌟 Conclusion

- Ce modèle de réponse API est **moderne**, **flexible**, **sécurisé**, et **orienté production**.
- Il est **prêt pour intégrer un système de logs**, un **APM** (Application Performance Monitoring) ou une solution de **tracing**.
- C'est la **base solide** pour construire une API digne d'une startup tech sérieuse ou d'une grosse entreprise.

---

## 🎯 Prochaine étape possible (optionnelle)

Si tu veux aller encore plus loin :
- Ajout d'**erreurs personnalisées** (ValidationError, NotFoundError, etc.)
- Ajout automatique du `traceId` à partir d'un middleware Express (sans devoir le passer manuellement)
- Compatible avec OpenTelemetry pour le tracing distribué !

---