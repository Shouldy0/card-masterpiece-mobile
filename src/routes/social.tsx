import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import { useState } from "react";
import {
  Users,
  MessageSquare,
  Shield,
  UserPlus,
  Send,
  Circle,
  Swords,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sounds } from "@/utils/audio";

export const Route = createFileRoute("/social")({ component: Social });

type Tab = "friends" | "chat" | "guild";

function Social() {
  const [activeTab, setActiveTab] = useState<Tab>("friends");
  const { friends, messages, guild, sendMessage, addFriend } = useGame();
  const [msgInput, setMsgInput] = useState("");
  const [friendInput, setFriendInput] = useState("");

  const handleSend = () => {
    if (!msgInput.trim()) return;
    sounds.play("chime");
    sendMessage(msgInput);
    setMsgInput("");
  };

  const handleAddFriend = () => {
    if (!friendInput.trim()) return;
    sounds.play("victory");
    addFriend(friendInput);
    setFriendInput("");
  };

  return (
    <MobileFrame>
      <header className="px-4 pt-6 pb-2">
        <h1 className="font-display text-xl gold-text tracking-widest uppercase mb-4">
          Hub Sociale
        </h1>

        {/* Tab Selector */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          {[
            { id: "friends", icon: Users, label: "Amici" },
            { id: "chat", icon: MessageSquare, label: "Chat" },
            { id: "guild", icon: Shield, label: "Gilda" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as Tab);
                sounds.play("lock");
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all",
                activeTab === t.id
                  ? "bg-gold text-black shadow-lg"
                  : "text-white/40 hover:text-white",
              )}
            >
              <t.icon className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col px-4 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === "friends" && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex flex-col gap-4"
            >
              {/* Add Friend Input */}
              <div className="flex gap-2 mb-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-white/30" />
                  <input
                    value={friendInput}
                    onChange={(e) => setFriendInput(e.target.value)}
                    placeholder="CERCA SOGNATORE..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50"
                  />
                </div>
                <button
                  onClick={handleAddFriend}
                  className="px-4 rounded-xl bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all"
                >
                  <UserPlus className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pb-20 custom-scrollbar">
                {friends.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-2xl bg-card/40 border border-white/5 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="size-10 rounded-full bg-gradient-to-br from-mystic/40 to-abyss border border-white/10 flex items-center justify-center">
                          <Users className="size-4 text-white/30" />
                        </div>
                        <Circle
                          className={cn(
                            "absolute bottom-0 right-0 size-2.5 fill-current stroke-abyss stroke-2",
                            f.status === "online" ? "text-emerald-400" : "text-white/20",
                          )}
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{f.name}</h4>
                        <p className="text-[8px] text-white/40 uppercase tracking-widest">
                          {f.rank}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-gold transition-colors">
                        <Swords className="size-3.5" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-gold transition-colors">
                        <MessageSquare className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto space-y-4 pb-4 custom-scrollbar">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn("flex flex-col", m.from === "Tu" ? "items-end" : "items-start")}
                  >
                    <div className="flex items-center gap-2 mb-1 px-2">
                      <span className="text-[8px] font-black uppercase text-gold/60">{m.from}</span>
                      <span className="text-[7px] text-white/20">{m.time}</span>
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] p-3 rounded-2xl text-[11px] leading-relaxed",
                        m.from === "Tu"
                          ? "bg-gold text-black rounded-tr-none"
                          : "bg-white/5 text-white/80 border border-white/10 rounded-tl-none",
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="pb-24 pt-2">
                <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <input
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="SCRIVI UN MESSAGGIO..."
                    className="flex-1 bg-transparent border-none pl-2 text-[10px] text-white placeholder:text-white/20 focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    className="p-3 rounded-xl bg-gold text-black shadow-lg hover:scale-105 transition-all"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "guild" && (
            <motion.div
              key="guild"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex flex-col gap-6"
            >
              {guild ? (
                <>
                  <div className="p-8 rounded-[3rem] bg-gradient-to-br from-mystic/20 to-abyss border border-gold/20 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Shield className="size-32 text-gold" />
                    </div>
                    <div className="size-20 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center mb-4">
                      <Shield className="size-10 text-gold" />
                    </div>
                    <h2 className="font-display text-2xl text-white font-bold uppercase tracking-widest">
                      {guild.name}
                    </h2>
                    <p className="text-[9px] text-gold/60 font-black uppercase tracking-[0.3em] mb-6">
                      Livello Gilda {guild.level}
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[8px] text-white/30 uppercase mb-1">Membri</p>
                        <p className="text-sm font-bold text-white">{guild.members}/50</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[8px] text-white/30 uppercase mb-1">Rango Gilda</p>
                        <p className="text-sm font-bold text-gold">Top 100</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[9px] font-black uppercase text-white/40 tracking-[0.3em] px-2">
                      Obiettivo Settimanale
                    </h5>
                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] text-emerald-400 font-bold">
                          Vittorie Collettive
                        </span>
                        <span className="text-[9px] text-white/40">124 / 200</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: "62%" }} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <Shield className="size-16 text-white/10 mb-4" />
                  <h3 className="font-display text-lg text-white mb-2 uppercase">Nessuna Gilda</h3>
                  <p className="text-[10px] text-white/40 leading-relaxed mb-8">
                    Unisciti a una gilda per sbloccare sfide cooperative e premi esclusivi.
                  </p>
                  <button className="w-full py-4 rounded-2xl bg-gold text-black font-black uppercase tracking-widest text-[11px] shadow-lg">
                    Trova Gilda
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </MobileFrame>
  );
}
