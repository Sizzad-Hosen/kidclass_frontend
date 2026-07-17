import Link from "next/link";
import { Blocks, Brain, Calculator, Languages, Puzzle, Rocket, Sparkles } from "lucide-react";

import { PageShell } from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const gameIdeas = [
  { title: "Word Builder", description: "Drag letters into place, hear the word, and earn stars for correct spelling.", level: "English & Bangla", Icon: Languages, tone: "bg-pink-100 text-pink-700" },
  { title: "Number Rocket", description: "Solve quick sums to fuel a rocket through colorful learning planets.", level: "Math", Icon: Rocket, tone: "bg-sky-100 text-sky-700" },
  { title: "Science Match Lab", description: "Match animals, plants, weather, and materials with their correct groups.", level: "Science", Icon: Puzzle, tone: "bg-emerald-100 text-emerald-700" },
  { title: "Memory Cards", description: "Flip cards and find matching concepts from lessons you have completed.", level: "All Courses", Icon: Brain, tone: "bg-violet-100 text-violet-700" },
  { title: "Shape Constructor", description: "Build friendly objects from shapes while learning size, color, and position.", level: "Early Learning", Icon: Blocks, tone: "bg-amber-100 text-amber-700" },
  { title: "Speed Counting", description: "Count objects before time runs out and unlock harder number challenges.", level: "Math", Icon: Calculator, tone: "bg-orange-100 text-orange-700" },
];

export default function GamesPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-5 py-12">
        <section className="rounded-[2.5rem] bg-gradient-to-r from-violet-700 to-sky-700 p-8 text-white sm:p-12">
          <Badge variant="yellow">Game Lab Ideas</Badge>
          <h1 className="mt-5 text-4xl font-black sm:text-6xl">Learn by playing</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-violet-50">
            These game concepts connect directly to KidClass lessons. Each one can reward stars, badges, and course progress after gameplay is implemented.
          </p>
        </section>
        <section className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gameIdeas.map(({ title, description, level, Icon, tone }) => (
            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl" key={title}>
              <span className={`grid size-14 place-items-center rounded-2xl ${tone}`}><Icon className="size-7" /></span>
              <p className="mt-5 text-xs font-black uppercase tracking-wider text-sky-700">{level}</p>
              <h2 className="mt-1 text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{description}</p>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-400"><Sparkles className="size-4" /> Concept ready for development</div>
            </article>
          ))}
        </section>
        <div className="mt-9 text-center"><Button asChild className="rounded-full bg-sky-700 px-8"><Link href="/courses">Choose a Course</Link></Button></div>
      </main>
    </PageShell>
  );
}
