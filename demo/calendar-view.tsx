"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GoogleGenAI, Type } from "@google/genai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Copy, Loader2, Sparkles, Image as ImageIcon, Hash, RefreshCcw } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

interface CalendarDay {
  day: number;
  topic: string;
  description: string;
}

interface PostContent {
  title: string;
  content: string;
  tags: string[];
  imageSuggestions: string[];
}

export function CalendarView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const niche = searchParams.get("niche") || "";
  const audience = searchParams.get("audience") || "";
  const tone = searchParams.get("tone") || "";

  const [isGeneratingCalendar, setIsGeneratingCalendar] = useState(false);
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [postContent, setPostContent] = useState<PostContent | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!niche) {
      router.push("/");
      return;
    }
    if (!hasFetched.current) {
      hasFetched.current = true;
      generateCalendar();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [niche, router]);

  const generateCalendar = async () => {
    setIsGeneratingCalendar(true);
    setCalendar([]);
    setSelectedDay(null);
    setPostContent(null);

    let prompt = `Generate a 7-day Xiaohongshu (Little Red Book) content calendar for the following niche/positioning: "${niche}".`;
    if (audience) prompt += `\nTarget Audience: "${audience}".`;
    if (tone) prompt += `\nContent Tone: "${tone}".`;
    prompt += `\nThe content should be engaging, trendy, and suitable for the Xiaohongshu platform.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER, description: "Day number from 1 to 7" },
                topic: { type: Type.STRING, description: "A catchy topic for the post" },
                description: { type: Type.STRING, description: "A brief description of what the post will be about" },
              },
              required: ["day", "topic", "description"],
            },
          },
        },
      });

      const jsonStr = response.text?.trim() || "[]";
      const parsedCalendar = JSON.parse(jsonStr) as CalendarDay[];
      setCalendar(parsedCalendar);
      toast.success("7-day content calendar generated!");
    } catch (error) {
      console.error("Error generating calendar:", error);
      toast.error("Failed to generate calendar. Please try again.");
    } finally {
      setIsGeneratingCalendar(false);
    }
  };

  const generatePost = async (day: CalendarDay) => {
    setSelectedDay(day);
    setIsGeneratingPost(true);
    setPostContent(null);

    let prompt = `Write a complete Xiaohongshu (Little Red Book) post based on this topic: "${day.topic}". 
    Description: "${day.description}".
    Niche: "${niche}".`;
    if (audience) prompt += `\nTarget Audience: "${audience}".`;
    if (tone) prompt += `\nContent Tone: "${tone}".`;
    
    prompt += `\n\nThe post must include:
    1. A catchy, click-worthy title (often using emojis).
    2. Engaging main content with appropriate formatting, emojis, and a conversational tone typical of Xiaohongshu.
    3. Relevant hashtags.
    4. Suggestions for what images/photos to include in the post carousel.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The title of the post" },
              content: { type: Type.STRING, description: "The main body text of the post" },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of hashtags without the # symbol" 
              },
              imageSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of descriptions for images to include"
              }
            },
            required: ["title", "content", "tags", "imageSuggestions"],
          },
        },
      });

      const jsonStr = response.text?.trim() || "{}";
      const parsedPost = JSON.parse(jsonStr) as PostContent;
      setPostContent(parsedPost);
      toast.success(`Post for Day ${day.day} generated!`);
    } catch (error) {
      console.error("Error generating post:", error);
      toast.error("Failed to generate post. Please try again.");
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const copyToClipboard = () => {
    if (!postContent) return;
    
    const tagsString = postContent.tags.map(tag => `#${tag}`).join(" ");
    const textToCopy = `${postContent.title}\n\n${postContent.content}\n\n${tagsString}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy text.");
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/")} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Form
        </Button>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="font-medium text-foreground">Niche:</span> {niche}
          {audience && <><span className="text-neutral-300">|</span><span className="font-medium text-foreground">Audience:</span> {audience}</>}
          {tone && <><span className="text-neutral-300">|</span><span className="font-medium text-foreground">Tone:</span> {tone}</>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calendar */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>Select a day to generate the full post.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={generateCalendar} disabled={isGeneratingCalendar} title="Regenerate Calendar">
                <RefreshCcw className={`h-4 w-4 ${isGeneratingCalendar ? "animate-spin" : ""}`} />
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              {isGeneratingCalendar ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {calendar.map((day) => (
                      <div 
                        key={day.day}
                        onClick={() => generatePost(day)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedDay?.day === day.day 
                            ? "border-[#ff2442] bg-[#ff2442]/5" 
                            : "hover:border-[#ff2442]/50 hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#ff2442]">Day {day.day}</span>
                          {selectedDay?.day === day.day && isGeneratingPost && (
                            <Loader2 className="h-3 w-3 animate-spin text-[#ff2442]" />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{day.topic}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Post Content */}
        <div className="lg:col-span-7">
          <Card className="h-full min-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>
                {selectedDay ? `Draft for Day ${selectedDay.day}: ${selectedDay.topic}` : "Select a day from the calendar to generate a post."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {isGeneratingPost ? (
                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ) : postContent ? (
                <ScrollArea className="flex-1 h-[500px] pr-4">
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold">{postContent.title}</h3>
                    </div>
                    
                    <Separator />
                    
                    {/* Content */}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {postContent.content}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {postContent.tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          <Hash className="w-3 h-3 mr-0.5" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Separator />

                    {/* Image Suggestions */}
                    <div className="bg-neutral-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center text-sm font-semibold text-neutral-700">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Image/Carousel Suggestions
                      </div>
                      <ul className="space-y-2">
                        {postContent.imageSuggestions.map((img, i) => (
                          <li key={i} className="text-xs text-neutral-600 flex items-start">
                            <span className="font-medium mr-2 text-neutral-400">{i + 1}.</span>
                            {img}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-neutral-300" />
                  </div>
                  <p>Your generated post will appear here.</p>
                </div>
              )}
            </CardContent>
            {postContent && !isGeneratingPost && (
              <CardFooter className="border-t pt-6">
                <Button onClick={copyToClipboard} className="w-full" variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Title, Content & Tags for Publishing
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
