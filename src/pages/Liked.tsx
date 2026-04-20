import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLikedArtworks } from "../contexts/LikedContext";

const Liked = () => {
	const { likedItems, totalLiked, removeLike, clearLikes } = useLikedArtworks();

	return (
		<div className="min-h-screen bg-background text-foreground">
			<Navbar />
			<main className="container mx-auto px-4 pb-20 pt-28 md:px-8">
				<div className="mb-10 flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Your collection</p>
						<h1 className="page-title mt-3 font-serif font-bold">Liked Artworks</h1>
						<p className="mt-3 text-muted-foreground">{totalLiked} artwork{totalLiked === 1 ? "" : "s"} saved from curated picks and gallery.</p>
					</div>
					{totalLiked > 0 && (
						<Button
							type="button"
							variant="outline"
							onClick={clearLikes}
							className="rounded-full border-foreground/20 px-6"
						>
							Clear all
						</Button>
					)}
				</div>

				{likedItems.length === 0 ? (
					<div className="rounded-3xl border border-border bg-card p-12 text-center">
						<Heart className="mx-auto h-12 w-12 text-muted-foreground" />
						<h2 className="mt-5 text-2xl font-serif">No liked artworks yet</h2>
						<p className="mt-3 text-sm text-muted-foreground">Tap the heart on Curator Picks or gallery cards and they will appear here.</p>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
							<Link to="/" className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90">
								Browse home
							</Link>
							<Link to="/explore" className="rounded-full border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted">
								Explore art
							</Link>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{likedItems.map((item) => (
							<article key={item.id} className="overflow-hidden rounded-3xl border border-border bg-card">
								<div className="relative aspect-square overflow-hidden">
									<img src={item.image} alt={item.title} className="h-full w-full object-cover" />
									<span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur">
										{item.source}
									</span>
								</div>
								<div className="p-6">
									<h3 className="font-serif text-xl font-semibold">{item.title}</h3>
									<p className="mt-1 text-sm text-muted-foreground">{item.artist}</p>
									<p className="mt-3 text-sm font-medium">{item.price}</p>

									<div className="mt-5 flex items-center gap-3">
										{item.href ? (
											<Link
												to={item.href}
												className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90"
											>
												View artwork
											</Link>
										) : (
											<span className="rounded-full bg-muted px-5 py-2 text-sm text-muted-foreground">Gallery item</span>
										)}
										<button
											type="button"
											onClick={() => removeLike(item.id)}
											className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted"
										>
											<Trash2 className="h-4 w-4" />
											Remove
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
};

export default Liked;
