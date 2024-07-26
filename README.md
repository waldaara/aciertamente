## Aciertamente

To run this project, you need to have Bun installed on your machine and a Neon Project.

```bash
git clone
cd aciertamente
```

Before running the project, you need to install the dependencies.

```bash
bun install
```

Now, you need to set the environment variables. You can find the environment variables in the `.env.example` file. Create a new file called `.env.local` and copy the content from the `.env.example` file. Fill in the values with your own credentials of your **development** branch.

```bash
cp .env.example .env.local
```

Now, you can run the project.

```bash
bun run dev
```

The project will be running on `http://localhost:3000`.
