import {GRAPH_FIELDS} from '@constants/graph';
import {route} from '@constants/route';
import type {GraphCrew} from '@type/Graph.type';
import Link from 'next/link';

interface GraphCrewListProps {
  crews: GraphCrew[];
}

const GraphCrewList = ({crews}: GraphCrewListProps) => (
  <section aria-labelledby="graph-crew-list-heading" className="flex flex-col gap-4">
    <h2 id="graph-crew-list-heading" className="text-lg font-bold text-grayscale-800">
      크루 목록 ({crews.length}명)
    </h2>
    <p className="text-sm text-grayscale-600">그래프에 표시된 크루를 목록으로 확인할 수 있습니다.</p>
    <ul className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
      {crews.map(crew => (
        <li key={crew.id}>
          <Link
            href={route.goWiki(crew.documentUuid)}
            className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-solid border-grayscale-200 px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700"
          >
            <span className="text-primary-700 underline">{crew.title}</span>
            <span className="text-sm text-grayscale-600">
              {crew.generation} · {GRAPH_FIELDS.find(field => field.id === crew.field)?.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default GraphCrewList;
