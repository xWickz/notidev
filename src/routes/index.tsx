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
			<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{noticias?.map(({ id, titulo, fecha, resumen }: Noticia) => (
					<article
						key={titulo}
						className="island-shell feature-card rise-in rounded-2xl p-5 select-none"
						style={{ animationDelay: `${id * 90 + 80}ms` }}
					>
						<h2 className="m-0 shrink-0 text-sm mb-2 font-black tracking-tight">
							{fecha}
						</h2>
						<h2 className="mb-2 text-base font-semibold text-(--sea-ink)">
							{titulo}
						</h2>
						<p className="m-0 text-sm text-(--sea-ink-soft)">{resumen}</p>
					</article>
				))}
			</section>
			<button
				type="button"
				className="btn mt-8 mx-auto block"
				onClick={loadMore}
				disabled={loading}
			>
				{loading ? "Cargando..." : "Cargar más"}
			</button>
		</main>
	);
}
