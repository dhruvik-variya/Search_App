import React from 'react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, useSearchBox, useHits, useRefinementList } from 'react-instantsearch';

// Using Algolia's public demo e-commerce dataset
const searchClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');

function CustomSearchBox() {
  const { query, refine, clear } = useSearchBox();

  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      <input
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder="Search for laptops, phones, appliances..."
        className="w-full h-14 pl-12 pr-12 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-slate-400 outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300"
      />
      {query && (
        <button 
          onClick={() => clear()} 
          className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      )}
    </div>
  );
}

function CustomRefinementList() {
  const { items, refine } = useRefinementList({ attribute: 'categories', limit: 10 });

  return (
    <div className="relative group w-full">
      <select
        onChange={(e) => {
          items.filter(item => item.isRefined).forEach(item => refine(item.value));
          if (e.target.value) {
            refine(e.target.value);
          }
        }}
        className="w-full h-14 pl-4 pr-10 appearance-none rounded-2xl border border-white/10 bg-white/5 text-white outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 cursor-pointer"
      >
        <option value="" className="bg-slate-800 text-white">All Categories</option>
        {items.map((item) => (
          <option key={item.value} value={item.value} className="bg-slate-800 text-white">
            {item.label} ({item.count})
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}

function CustomHits() {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="col-span-full text-center py-20 animate-fade-in">
        <div className="inline-block p-6 rounded-3xl bg-white/5 border border-white/10">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-xl font-semibold text-white">No products found</h3>
          <p className="text-slate-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {hits.map((item, index) => (
        <div
          key={item.objectID}
          className="group relative rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] animate-fade-in-up overflow-hidden"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-500 ease-out z-0"></div>
          
          <div className="relative z-10 aspect-[4/3] rounded-2xl bg-white p-4 mb-5 overflow-hidden shadow-inner flex items-center justify-center">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply"
            />
          </div>
          
          <div className="relative z-10 flex flex-col h-[140px] justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-3 line-clamp-1">
                {item.categories && item.categories[0] ? item.categories[0] : 'Product'}
              </span>
              <h2 className="font-bold text-lg leading-tight line-clamp-2 text-white group-hover:text-indigo-300 transition-colors">
                {item.name}
              </h2>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                ${item.price}
              </p>
              <button className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all duration-300 group/btn">
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stat() {
  const { hits } = useHits();
  return <p className="text-slate-400 font-medium">Showing top results</p>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <InstantSearch searchClient={searchClient} indexName="instant_search">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Section */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl text-center relative overflow-hidden group animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"></div>
            <h1 className="relative text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              Algolia Instant Search
            </h1>
            <p className="relative text-slate-400 mt-4 text-lg md:text-xl font-medium tracking-wide">
              Ultra-fast Search Experience via Algolia API
            </p>
          </div>

          {/* Search & Filter Section */}
          <div className="grid md:grid-cols-3 gap-6 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl animate-fade-in-up">
            <div className="md:col-span-2 relative group">
              <CustomSearchBox />
            </div>

            <div className="relative group">
              <CustomRefinementList />
            </div>
          </div>

          <div className="flex justify-between items-center px-2 animate-fade-in">
            <Stat />
          </div>

          {/* Product Grid */}
          <CustomHits />

        </div>
      </InstantSearch>
    </div>
  );
}
