"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MessageSquare, Briefcase, Zap, Settings, Copy, BookOpen, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- TYPES ---
interface Artifact {
  title: string;
  type: string;
  content: string;
}

export default function PlayTherapyOS() {
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading } = useChat({
    onFinish: (message) => {
      // Logic to "intercept" artifacts from the stream
      const artifactMatch = message.content.match(/\[ARTIFACT_START\](.*?)\[ARTIFACT_END\]/s);
      if (artifactMatch) {
        try {
          const data = JSON.parse(artifactMatch[1]);
          setActiveArtifact(data);
        } catch (e) {
          console.error("Failed to parse artifact", e);
        }
      }
    }
  });

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hasDialogue = messages.length > 0;

  return (
    <div className="flex h-screen w-full bg-[#F9F8F6] font-sans text-stone-900 overflow-hidden">
      
      {/* 1. TOP NAVIGATION PILL */}
      <div className="fixed top-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="flex gap-1 p-1 bg-white/60 backdrop-blur-xl border border-stone-200/50 rounded-full shadow-sm pointer-events-auto transition-all hover:shadow-md">
          {['Dialogue', 'Mindgraph', 'Library'].map((tab) => (
            <Button key={tab} variant="ghost" className="rounded-full px-6 h-9 text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900">
              {tab}
            </Button>
          ))}
          <Button variant="ghost" className="rounded-full px-6 h-9 text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 gap-2">
            Gym <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none px-1.5 py-0 text-[9px]">8</Badge>
          </Button>
        </div>
      </div>

      {/* 2. SIDEBAR (The Vault) */}
      <aside className={`transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'} bg-[#F1EFE9] border-r border-stone-200/50 flex flex-col p-6`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-xl italic tracking-tight">The Vault</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}><Settings size={16} /></Button>
        </div>
        
        <Button 
          onClick={() => { setMessages([]); setActiveArtifact(null); }}
          className="w-full justify-center gap-2 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 shadow-sm mb-8 py-6"
        >
          <Plus size={18} /> New chat
        </Button>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
          <Input placeholder="Search records..." className="pl-9 rounded-xl bg-stone-100/50 border-transparent focus:bg-white text-xs h-9" />
        </div>

        <ScrollArea className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 px-2">Recents</p>
          <div className="space-y-1 px-1">
            {['Axline Principles', 'Case Review: Leo', 'Handout Design'].map((title) => (
              <button key={title} className="w-full text-left px-3 py-2.5 text-xs text-stone-600 truncate rounded-xl hover:bg-white/60 transition-colors">
                {title}
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 relative flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {!hasDialogue ? (
            /* --- ARRIVAL STATE --- */
            <motion.div 
              key="arrival"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center max-w-2xl px-6"
            >
              <h1 className="font-serif text-7xl tracking-tighter mb-6 text-center">Afternoon, Marcos ✨</h1>
              <p className="text-stone-400 text-lg mb-12 italic font-light text-center">Your clinical intelligence workspace is calm and ready.</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {['Plan Lesson', 'Explain Theory', 'Review Case', 'Design Handout'].map(chip => (
                  <Button key={chip} variant="outline" className="rounded-full px-6 py-5 border-stone-200 text-stone-500 hover:border-stone-900 hover:text-stone-900 transition-all text-xs">
                    {chip}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* --- ACTIVE STATE (Split Pane) --- */
            <motion.div 
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex w-full overflow-hidden"
            >
              {/* Left Pane: Chat Stream */}
              <div className={`transition-all duration-500 ${activeArtifact ? 'w-3/5' : 'w-full'} flex flex-col pt-24 pb-32 overflow-hidden`}>
                <ScrollArea ref={scrollRef} className="flex-1 px-12 lg:px-24">
                  <div className="max-w-3xl mx-auto space-y-12">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {m.role === 'user' ? (
                          <div className="bg-[#F1EFE9] p-6 rounded-[2rem] rounded-br-lg border border-stone-200/50 max-w-[85%] text-lg leading-relaxed shadow-sm">
                            {m.content}
                          </div>
                        ) : (
                          <div className="w-full">
                            <div className="flex items-center gap-3 mb-4 text-stone-400">
                              <Zap size={16} className="text-orange-400 fill-orange-400" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Clinical Mentor</span>
                            </div>
                            <div className="prose prose-stone prose-lg max-w-none text-stone-800 leading-relaxed font-normal">
                              {m.content.replace(/\[ARTIFACT_START\].*?\[ARTIFACT_END\]/gs, "")}
                            </div>
                            <div className="flex gap-2 mt-6">
                              <Button variant="ghost" size="sm" className="rounded-full text-stone-400 hover:text-stone-900 gap-2 h-8 px-4 text-[10px] font-bold uppercase"><Copy size={12}/> Copy</Button>
                              <Button variant="ghost" size="sm" className="rounded-full text-stone-400 hover:text-stone-900 gap-2 h-8 px-4 text-[10px] font-bold uppercase"><Share2 size={12}/> Share</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Right Pane: Artifact Panel */}
              {activeArtifact && (
                <motion.div 
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="w-2/5 p-8 pt-24 bg-white/20 backdrop-blur-md"
                >
                  <Card className="h-full border-stone-200/50 rounded-[2rem] shadow-2xl shadow-stone-200/30 overflow-hidden flex flex-col bg-white">
                    <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                      <div>
                        <Badge variant="secondary" className="mb-2 bg-stone-100 text-stone-500 rounded-full font-bold uppercase text-[9px] px-3 py-0.5">{activeArtifact.type}</Badge>
                        <h3 className="font-serif text-3xl leading-tight text-stone-900">{activeArtifact.title}</h3>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-stone-100" onClick={() => setActiveArtifact(null)}>✕</Button>
                    </div>
                    <ScrollArea className="flex-1 p-8">
                      <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap">
                        {activeArtifact.content}
                      </div>
                      <div className="mt-12 pt-8 border-t border-stone-100 flex gap-3">
                        <Button className="flex-1 rounded-2xl h-12 bg-stone-900 hover:bg-stone-800 text-white font-medium">Download Handout</Button>
                        <Button variant="outline" className="flex-1 rounded-2xl h-12 border-stone-200 text-stone-600 hover:bg-stone-50 font-medium">Add to Library</Button>
                      </div>
                    </ScrollArea>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. FLOATING INPUT BAR */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center px-6 z-[10001]">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}
            className="relative w-full max-w-2xl group flex items-center"
          >
            <div className="absolute left-6 h-6 w-6 flex items-center justify-center text-stone-400">
              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin hidden group-data-[loading=true]:block" />
              <Plus size={20} className="group-data-[loading=true]:hidden" />
            </div>
            <Input 
              value={input}
              onChange={handleInputChange}
              placeholder="Inscribe a thought..." 
              className="h-16 pl-14 pr-24 rounded-full border-stone-200/60 bg-white/90 backdrop-blur-xl shadow-2xl shadow-stone-300/40 focus-visible:ring-stone-400/20 focus-visible:border-stone-300 transition-all text-lg placeholder:text-stone-300"
            />
            <div className="absolute right-3 flex items-center gap-2">
              <Badge variant="outline" className="bg-stone-50/50 text-stone-400 text-[10px] font-mono px-3 py-1 border-stone-100 rounded-full hidden sm:block">
                Gemini 2.0
              </Badge>
              <Button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 rounded-full bg-stone-900 hover:bg-black text-white p-0 shadow-lg shadow-stone-200 transition-transform active:scale-95"
              >
                <Zap size={18} fill="white" />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
