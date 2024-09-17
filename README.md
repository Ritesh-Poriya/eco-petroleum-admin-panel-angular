# Eco Petroleum Admin Panel - Angular

This is the admin panel for the Eco Petroleum project, built using Angular.

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- Node.js and npm installed on your machine.

## Installation

### Clone the Project

Clone the "Eco Petroleum Admin Panel - Angular" project repository to your local machine:

```bash
git clone https://gitlab.com/weetech/eco-petroleum-admin-panel-angular.git
```

### Install Dependencies

Navigate to the project directory and install the required dependencies:
```bash
cd eco-petroleum-admin-panel-angular
npm install
npm start
```
If you encounter an error related to `ngx-spinner`, follow one of the two options below:

1. Change code in node_modules:
In the file `node_modules/ngx-spinner/lib/ngx-spinner.component.d.ts`, add or replace the following code at the end:

```typescript 
static ɵcmp: i0.ɵɵComponentDeclaration<NgxSpinnerComponent, "ngx-spinner", never, {
      "bdColor": "";
      "size": "";
      "color": "";
      "type": "";
      "fullScreen": "";
      "name": "";
      "zIndex": "";
      "template": "";
      "showSpinner": "";
      "disableAnimation": ""; }, {}, never, ["*"], false, never>;
```
2. Add "skipLibCheck" to tsconfig.json:
Insert the following line in the `tsconfig.json` file, under "compilerOptions":
```bash
"skipLibCheck" : true
```
After making changes to the code or configuration, especially within the `node_modules` directory or the `tsconfig.json` file, it's a good practice to restart your Angular project to ensure that the changes take effect. Here's how you can restart your Angular project.

## Environment Files

The project uses Angular environment files to store configuration settings. There are two default environment files:

- `src/environments/environment.ts` for development
- `src/environments/environment.prod.ts` for production

You can add more environment files if needed.

Example of `environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://bedevportal.ecopetroleum.ca', // Your development API URL
};
```

Example of `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: "https://bedevportal.ecopetroleum.ca", // Your production API URL
};
```
## Building for Different Environments
When building your Angular application, specify the target environment using the --configuration flag.

Example for production build:

```bash
ng build --configuration=production
```
Angular will use the `environment.prod.ts` file for the production build.

