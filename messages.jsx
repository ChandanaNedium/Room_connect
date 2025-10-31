import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Send } from "lucide-react";
import { format } from "date-fns";

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.ChatConversation.list('-last_message_time'),
    initialData: [],
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', selectedConversation?.id],
    queryFn: async () => {
      if (!selectedConversation) return [];
      const allMessages = await base44.entities.ChatMessage.list();
      return allMessages.filter(m => m.conversation_id === selectedConversation.id);
    },
    enabled: !!selectedConversation,
    initialData: [],
  });

  return (
    <div className="h-screen flex">
      {/* Conversations List */}
      <div className="w-full md:w-96 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-2">Start chatting with property owners or tenants</p>
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-orange-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-400 text-white">
                      {conv.participant_2_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">{conv.participant_2_name}</p>
                      {conv.last_message_time && (
                        <span className="text-xs text-gray-500">
                          {format(new Date(conv.last_message_time), 'MMM d')}
                        </span>
                      )}
                    </div>
                    {conv.property_name && (
                      <p className="text-xs text-gray-600 mb-1">Re: {conv.property_name}</p>
                    )}
                    <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                  </div>
                  {conv.unread_count_1 > 0 && (
                    <Badge className="bg-orange-500">{conv.unread_count_1}</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            <div className="bg-white p-4 border-b flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-400 text-white">
                  {selectedConversation.participant_2_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{selectedConversation.participant_2_name}</p>
                {selectedConversation.property_name && (
                  <p className="text-sm text-gray-600">{selectedConversation.property_name}</p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={flex ${msg.sender_name === selectedConversation.participant_2_name ? 'justify-start' : 'justify-end'}}
                >
                  <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                    msg.sender_name === selectedConversation.participant_2_name
                      ? 'bg-white'
                      : 'bg-orange-500 text-white'
                  }`}>
                    <p>{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender_name === selectedConversation.participant_2_name ? 'text-gray-500' : 'text-orange-100'
                    }`}>
                      {format(new Date(msg.created_date), 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setMessageText('');
                    }
                  }}
                />
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">Select a conversation</p>
              <p className="text-gray-400 text-sm mt-2">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
