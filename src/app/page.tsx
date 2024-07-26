import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db, user } from "@/drizzle";
import { NeonDbError } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = typeof user.$inferInsert;

export const revalidate = 0;

export default async function Home() {
  const users: User[] = await db.select().from(user);

  users.unshift({
    id: 0,
    name: "",
    email: "",
    password: "",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Welcome to Aciertamente</h1>

      <form
        action={async (formData: FormData) => {
          "use server";

          const name = formData.get("name") as string;
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          const role = formData.get("role") as "admin" | "customer";

          if (!name || !email || !password || !role) return;

          try {
            await db.insert(user).values({
              name,
              email,
              password,
              role,
              createdAt: new Date(),
            });
          } catch (error) {
            if (error instanceof NeonDbError) console.error(error.detail);
          }

          redirect("/");
        }}
        className="flex flex-col justify-center gap-4"
      >
        <p>
          <label>
            Name
            <Input name="name" required />
          </label>
        </p>

        <p>
          <label>
            Email
            <Input name="email" type="email" required />
          </label>
        </p>

        <p>
          <label>
            Password
            <Input name="password" type="password" required />
          </label>
        </p>

        <p>
          <label>
            Role
            <Select name="role" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
        </p>

        <Button type="submit" title="Create user">
          Create user
        </Button>
      </form>

      <h2 className="text-2xl font-bold">Users</h2>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(users[0]).map((key) => (
                <TableHead key={key}>{key}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.slice(1).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.createdAt.toDateString()}</TableCell>
                <TableCell>{user.updatedAt?.toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
