# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Payment receipts

Authenticated administrators can manage receipts from **Dashboard → Payment Receipts**. Receipt numbers are assigned by the API in the `CFU-RC-001` format. Receipts store the actual amount received, can optionally reference an official quotation, and are voided without deleting their history.

Protected API routes:

- `POST /api/payment-receipts` — issue a receipt.
- `GET /api/payment-receipts` — list receipts; supports `search`, `paymentMethod`, `status`, `dateFrom`, and `dateTo` query parameters.
- `GET /api/payment-receipts/:id` — retrieve a receipt.
- `GET /api/payment-receipts/:id/pdf` — preview a receipt PDF; add `?download=true` to download it.
- `PATCH /api/payment-receipts/:id/void` — void an issued receipt.

This application currently has no invoice model or invoice balance workflow, so receipts link to official quotations only and do not update invoice balances.

## Initial administrator provisioning

The initial administrator can be created once with `npm run provision:admin` from the `server` directory. Configure `MONGO_URI`, `ADMIN_FULL_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the server environment first. `ADMIN_PHONE_NUMBER` is optional. The password must be at least 12 characters. Provisioning exits without changing any account if an administrator already exists.

## Production API origins

Configure `CORS_ORIGINS` on the backend as a comma-separated list of confirmed frontend origins, for example `https://frontend.example` (replace this example with the actual origin). Production startup fails when this allowlist is missing. Do not include URL paths or a wildcard.

## Image upload limits

The backend accepts JPEG, PNG, and WebP images only. Default limits are 10 MB per project image, 5 MB per administrator profile photo, and 5 MB per company logo. Project before/after galleries accept up to four images each. These defaults can be changed with `UPLOAD_PROJECT_IMAGE_MAX_MB`, `UPLOAD_PROFILE_PHOTO_MAX_MB`, `UPLOAD_COMPANY_LOGO_MAX_MB`, and `UPLOAD_PROJECT_GALLERY_MAX_IMAGES`. Each value must be a positive whole number. Project images continue to upload to Cloudinary; profile photos and company logos continue to use local `/uploads` storage.
