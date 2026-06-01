import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "../utils/supabase";

export const Route = createFileRoute("/")({
	loader: async () => {
		const { data: noticias } = await supabase
			.from("noticias")
			.select("id, titulo, fecha, resumen")
			.order("id", { ascending: false });
		return noticias;
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
	const noticias = Route.useLoaderData();
	return (
		<main className="page-wrap px-4 pb-8 pt-1">
			<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{noticias?.map(({ id, titulo, fecha, resumen }: Noticia) => (
					<article
						key={titulo}
						className="island-shell feature-card rise-in rounded-2xl p-5"
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
		</main>
	);
}
