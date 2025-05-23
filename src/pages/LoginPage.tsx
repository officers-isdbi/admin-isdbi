// import { useFormik } from "formik";
// import { z } from "zod";
// import { toFormikValidationSchema } from "zod-formik-adapter";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";

// const loginSchema = z.object({
//   email: z.string().email("Email invalide"),
//   password: z
//     .string()
//     .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const { login } = useAuth();

//   const formik = useFormik<LoginFormValues>({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: toFormikValidationSchema(loginSchema),
//     onSubmit: async (values) => {
//       try {
//         await login(values.email, values.password);
//       } catch (error) {
//         console.error("Erreur de connexion:", error);
//       }
//     },
//   });

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background">
//       <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold">Connexion Admin</h1>
//           <p className="mt-2 text-muted-foreground">
//             Connectez-vous à votre compte administrateur
//           </p>
//         </div>

//         <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.email}
//               />
//               {formik.touched.email && formik.errors.email && (
//                 <p className="mt-1 text-sm text-destructive">
//                   {formik.errors.email}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium">
//                 Mot de passe
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.password}
//               />
//               {formik.touched.password && formik.errors.password && (
//                 <p className="mt-1 text-sm text-destructive">
//                   {formik.errors.password}
//                 </p>
//               )}
//             </div>
//           </div>

//           <Button
//             type="submit"
//             className="w-full"
//             disabled={formik.isSubmitting}
//           >
//             {formik.isSubmitting ? "Connexion en cours..." : "Se connecter"}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useSetUser } from '@/hooks/useUser';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/api/endpoints/auth';
import { toast } from 'sonner';

const loginSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z
		.string()
		.min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const { setUser } = useSetUser();
	const { mutateAsync: AuthMethod, isPending } = useMutation({
		mutationFn: loginUser,
		onSuccess: (response) => {
			if (!response.success) throw new Error(response.message);
			const auth = response.data;
			const { user } = auth;
			setUser(user);
			toast.success('welcome back.');
		},
		onError: (err) => {
			toast.error(err.message || 'An error occurred');
		},
	});
	const formik = useFormik<LoginFormValues>({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: toFormikValidationSchema(loginSchema),
		onSubmit: async (values) => {
			await AuthMethod(values);
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Connexion Admin</h1>
					<p className="mt-2 text-muted-foreground">
						Connectez-vous à votre compte administrateur
					</p>
				</div>

				<form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium"
							>
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.email}
							/>
							{formik.touched.email && formik.errors.email && (
								<p className="mt-1 text-sm text-destructive">
									{formik.errors.email}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium"
							>
								Mot de passe
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.password}
							/>
							{formik.touched.password &&
								formik.errors.password && (
									<p className="mt-1 text-sm text-destructive">
										{formik.errors.password}
									</p>
								)}
						</div>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={formik.isSubmitting || isPending}
					>
						{formik.isSubmitting
							? 'Connexion en cours...'
							: 'Se connecter'}
					</Button>

					<div className="text-center text-sm">
						<p>
							Pas encore de compte ?{' '}
							<Link
								to="/register"
								className="text-primary hover:underline"
							>
								Créer un compte
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
