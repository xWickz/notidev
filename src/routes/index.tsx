import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "../utils/supabase";

const MAX_NEWS = 5;

export const Route = createFileRoute("/")({
	loader: async () => {
		const { data: noticias } = await supabase
			.from("noticias")
			.select("id, titulo, fecha, resumen")
			.order("id", { ascending: false })
			.range(0, MAX_NEWS - 1);
		return noticias || [];
	},
	component: App,
});

type Noticia = {
	id: number;
	titulo: string;
	fecha?: string;
	resumen: string;
};
function App() {
	const initialData = Route.useLoaderData();
	const [noticias, setNoticias] = useState(initialData);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	const loadMore = async () => {
		setLoading(true);
		const start = page * MAX_NEWS;
		const end = start + MAX_NEWS - 1;
		const { data } = await supabase
			.from("noticias")
			.select("id, titulo, fecha, resumen")
			.order("id", { ascending: false })
			.range(start, end);

		if (data) {
			setNoticias((prev) => [...prev, ...data]);
			setPage((prev) => prev + 1);
		}
		setLoading(false);
	};

	return (
		<main className="page-wrap px-4 pb-8 pt-1">
			{/* Hero / Latest News */}
			<section className="mt-6 mb-10">
				<div className="border-b border-(--line) pb-4 mb-6">
					<span className="island-kicker text-xs tracking-[0.2em]">
						Últimas noticias
					</span>
				</div>
				{noticias && noticias.length > 0 && (
					<article className="feature-card rounded-2xl p-6 sm:p-8 select-none">
						<time className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
							{noticias[0].fecha}
						</time>
						<h1 className="mt-3 mb-3 text-2xl sm:text-3xl font-extrabold leading-tight text-(--text-primary)">
							{noticias[0].titulo}
						</h1>
						<p className="m-0 text-base text-(--text-secondary) leading-relaxed max-w-2xl">
							{noticias[0].resumen}
						</p>
					</article>
				)}
			</section>

			{/* More News Grid */}
			<section>
				<div className="border-b border-(--line) pb-4 mb-6">
					<span className="island-kicker text-xs tracking-[0.2em]">
						Más noticias
					</span>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{noticias?.slice(1).map(({ id, titulo, fecha, resumen }: Noticia) => (
						<article
							key={titulo}
							className="island-shell feature-card rounded-2xl p-5 select-none"
							style={{ animationDelay: `${id * 90 + 80}ms` }}
						>
							<time className="block text-xs font-semibold text-(--text-muted) uppercase tracking-wider mb-2">
								{fecha}
							</time>
							<h2 className="mb-2 text-base font-bold leading-snug text-(--text-primary)">
								{titulo}
							</h2>
							<p className="m-0 text-sm text-(--text-secondary) leading-relaxed">
								{resumen}
							</p>
						</article>
					))}
				</div>
			</section>

			<button
				type="button"
				className="btn mt-10 mx-auto block"
				onClick={loadMore}
				disabled={loading}
			>
				{loading ? "Cargando..." : "Cargar más noticias"}
			</button>
		</main>
	);
}
