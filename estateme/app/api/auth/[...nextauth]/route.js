import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@/server/mongodb";
import employees from "@/model/employees";

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { employeeId, password } = credentials;
        try {
          await connectMongo();
          const employee = await employees.findOne({ employeeId });

          if (employee && employee.password === password) {
            return employee;
          }
          return null;
        } catch (err) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, employee }) => {
      if (employee) {
        token.employee = employee;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.employee = token.employee;
      }

      return session;
    },
  },
  secret: process.env.SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
