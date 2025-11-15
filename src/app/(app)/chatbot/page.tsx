'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockUserProfile, faqs } from '@/lib/data';
import type { ChatMessage } from '@/lib/types';
import { handleChatSubmit } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Leaf, User, Send, Loader2, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const formData = new FormData();
    formData.append('message', input);

    startTransition(async () => {
      const result = await handleChatSubmit(formData);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else if (result.response) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    });
  };

  const handleFaqClick = (question: string) => {
    setInput(question);
  };

  return (
    <main className="flex flex-1 flex-col p-4 md:p-8 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        <div className="lg:col-span-2 flex flex-col h-full">
          <Card className="flex-1 flex flex-col shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 font-headline">
                <Bot /> AI Coach
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Leaf className="h-12 w-12 mb-4 text-primary"/>
                        <p className="text-lg">Welcome to your AI Coach!</p>
                        <p>Ask me anything about your carbon footprint.</p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex items-start gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'rounded-lg px-3 py-2 max-w-sm',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                       {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={mockUserProfile.avatarUrl} />
                           <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isPending && (
                     <div className="flex items-start gap-3 justify-start">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                         <div className="bg-muted rounded-lg px-3 py-2">
                             <Loader2 className="h-5 w-5 animate-spin"/>
                         </div>
                     </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your carbon footprint..."
                    disabled={isPending}
                    autoComplete="off"
                  />
                  <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="hidden lg:block">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <Button key={index} variant="ghost" className="w-full justify-start text-left h-auto" onClick={() => handleFaqClick(faq)}>
                                {faq}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
