import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// We fetch memories from the backend
interface Memory {
  id: string;
  title: string;
  image_url: string;
  description: string;
  created_at: string;
}

export const Memories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/memories`);
        if (response.ok) {
          const data = await response.json();
          setMemories(data);
        }
      } catch (error) {
        console.error('Failed to fetch memories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMemories();
  }, []);

  return (
    <section id="memories" className="relative w-full bg-[#151111] py-24 px-6 md:px-16 overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-[#e6d0d2] tracking-wider uppercase mt-4">
              All Memories
            </h2>
          </div>
          <p className="text-xs uppercase tracking-widest text-white/50 max-w-xs mt-6 md:mt-0 leading-relaxed">
            A growing collection of unedited moments. Real, raw, and beautiful.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7a1022]"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && memories.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p>No memories have been archived yet.</p>
          </div>
        )}

        {/* Masonry/Grid Layout */}
        {!isLoading && memories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.map((memory, index) => (
              <motion.div 
                key={memory.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="border border-white/10 p-2 bg-[#100c0c] transition-colors duration-500 hover:border-white/30 hover:bg-[#1a1616]">
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img 
                      src={memory.image_url} 
                      alt={memory.title} 
                      className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      <p className="text-sm font-bold uppercase mb-2">{memory.title}</p>
                      <p className="text-xs text-white/80 line-clamp-3">{memory.description}</p>
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex justify-between items-center mt-3 text-[10px] text-white/50 border-t border-white/10 pt-2 uppercase px-1">
                    <span className="truncate max-w-[60%]">{memory.title}</span>
                    <span className="text-[#7a1022]">
                      {new Date(memory.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
    </section>
  );
};
