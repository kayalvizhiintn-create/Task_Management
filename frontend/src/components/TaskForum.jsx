import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquarePlus, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Reply,
  X,
  FileText,
  Image as ImageIcon,
  History
} from 'lucide-react';
import { taskCommentService } from '../services/taskCommentService';

export default function TaskForum({ currentUser, employees, taskId }) {
  const [comments, setComments] = useState([]);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // { commentId, userName }
  const [editingId, setEditingId] = useState(null); // { type: 'comment' | 'reply', commentId, replyId? }

  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');

  useEffect(() => {
    if (taskId) {
      loadComments();
    } else {
      setComments([]);
    }
  }, [taskId]);

  const loadComments = async () => {
    try {
      const res = await taskCommentService.getCommentsByTaskId(taskId);
      if (res.isSuccess && res.data) {
        const rawComments = res.data;
        const formattedComments = [];
        
        const topLevel = rawComments.filter(c => !c.parentCommentId);
        const replies = rawComments.filter(c => c.parentCommentId);
        
        topLevel.forEach(c => {
          const commentReplies = replies.filter(r => r.parentCommentId === c.commentId).map(r => ({
            id: r.commentId,
            userId: r.userId,
            userName: r.userDisplayName || "User",
            userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userDisplayName || "User")}&background=random`,
            text: r.commentText,
            timestamp: r.createdTime
          }));
          
          let attach = null;
          if (c.commentFiles && c.commentFiles.length > 0) {
            const file = c.commentFiles[0];
            const isImage = file.fileName.match(/\.(jpeg|jpg|gif|png)$/i) != null;
            // Provide a base64 inline image or generic icon
            attach = {
              id: file.fileId,
              name: file.fileName,
              type: isImage ? 'image' : 'file',
              url: `data:application/octet-stream;base64,${file.fileByte}`
            };
          }

          formattedComments.push({
            id: c.commentId,
            userId: c.userId,
            userName: c.userDisplayName || "User",
            userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.userDisplayName || "User")}&background=random`,
            text: c.commentText,
            attachment: attach,
            timestamp: c.createdTime,
            replies: commentReplies
          });
        });
        
        setComments(formattedComments);
      }
    } catch (error) {
      console.error("Failed to load comments", error);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); 
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
  };

  const renderTextWithMentions = (text) => {
    if (!text) return "";
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="text-primary font-bold bg-primary/10 px-1 rounded">{part}</span>;
      }
      return part;
    });
  };

  const handleAttachFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const mockUrl = URL.createObjectURL(file);
      setAttachment({
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: mockUrl,
        file: file
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskId) {
      alert("No team selected for comments.");
      return;
    }
    if (!inputText.trim() && !attachment) return;

    try {
      const userId = parseInt(currentUser?.id || currentUser?.userId, 10) || 1;
      
      if (editingId) {
        const formData = new FormData();
        formData.append('CommentId', editingId.replyId || editingId.commentId);
        formData.append('TaskId', taskId);
        formData.append('UserId', userId);
        formData.append('UserDisplayName', currentUser?.name || currentUser?.displayName || 'User');
        formData.append('CommentText', inputText);
        
        if (attachment && attachment.file) {
           formData.append('Files', attachment.file);
        }

        await taskCommentService.updateComment(formData, userId);
        setEditingId(null);
      } else {
        const formData = new FormData();
        formData.append('TaskId', taskId);
        formData.append('UserId', userId);
        formData.append('UserDisplayName', currentUser?.name || currentUser?.displayName || 'User');
        formData.append('CommentText', inputText);
        
        if (replyingTo) {
          formData.append('ParentCommentId', replyingTo.commentId);
        }
        
        if (attachment && attachment.file) {
          formData.append('Files', attachment.file);
        }

        await taskCommentService.createComment(formData);
        setReplyingTo(null);
      }
      
      setInputText('');
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      loadComments();
    } catch (error) {
      console.error("Failed to save comment", error);
      alert("Failed to save comment");
    }
  };

  const handleDelete = async (type, commentId, replyId = null) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      const idToDelete = type === 'reply' ? replyId : commentId;
      const userId = parseInt(currentUser?.id || currentUser?.userId, 10) || 1;
      await taskCommentService.deleteComment(idToDelete, userId, taskId);
      loadComments();
    } catch (error) {
      console.error("Failed to delete comment", error);
      alert("Failed to delete comment");
    }
  };

  const handleEdit = (item, type, commentId) => {
    setEditingId({ type, commentId, replyId: type === 'reply' ? item.id : null });
    setInputText(item.text);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    const words = inputText.split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith('@')) {
      setShowMentionMenu(true);
      setMentionFilter(lastWord.substring(1).toLowerCase());
    } else {
      setShowMentionMenu(false);
    }
  }, [inputText]);

  const insertMention = (name) => {
    const words = inputText.split(' ');
    words.pop(); 
    const newText = words.join(' ') + (words.length > 0 ? ' ' : '') + `@${name.replace(/\s+/g, '')} `;
    setInputText(newText);
    setShowMentionMenu(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const filteredEmployees = employees?.filter(e => e.name && e.name.toLowerCase().includes(mentionFilter)) || [];

  return (
    <div className="bg-white border border-slate-200/50 rounded-[1.5rem] lg:rounded-3xl shadow-premium p-5 lg:p-8 flex flex-col h-full max-h-[800px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <MessageSquarePlus size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Discussion Forum</h3>
            <p className="text-xs font-semibold text-slate-500">Collaborate, mention teammates, and share files.</p>
          </div>
        </div>
        <button 
          onClick={loadComments}
          disabled={!taskId}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="Revise History"
        >
          <History size={16} />
          History Revise
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar mb-4">
        {!taskId ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <MessageSquarePlus size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-semibold">Select a team to view its discussion forum.</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <MessageSquarePlus size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-semibold">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="group">
              <div className="flex gap-4">
                <img src={comment.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shadow-sm" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{comment.userName}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{formatTime(comment.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setReplyingTo({commentId: comment.id, userName: comment.userName}); if(inputRef.current) inputRef.current.focus(); }} className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Reply">
                        <Reply size={14} />
                      </button>
                      {((parseInt(currentUser?.id, 10) || 1) === comment.userId || !currentUser) && (
                        <>
                          <button onClick={() => handleEdit(comment, 'comment', comment.id)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete('comment', comment.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50/70 p-3.5 rounded-2xl rounded-tl-none border border-slate-100 break-words">
                    {renderTextWithMentions(comment.text)}
                  </div>

                  {comment.attachment && (
                    <div className="mt-2">
                      {comment.attachment.type === 'image' ? (
                        <a href={comment.attachment.url} target="_blank" rel="noreferrer" className="inline-block relative rounded-xl overflow-hidden border border-slate-200">
                          <img src={comment.attachment.url} alt="attachment" className="max-h-40 object-cover" />
                        </a>
                      ) : (
                        <a href={comment.attachment.url} download={comment.attachment.name} className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition border border-slate-200 p-2.5 rounded-xl w-max">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-xs font-bold text-slate-700">{comment.attachment.name}</span>
                        </a>
                      )}
                    </div>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-slate-100">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex gap-3 group/reply">
                          <img src={reply.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" />
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-xs">{reply.userName}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{formatTime(reply.timestamp)}</span>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                                {((parseInt(currentUser?.id, 10) || 1) === reply.userId || !currentUser) && (
                                  <>
                                    <button onClick={() => handleEdit(reply, 'reply', comment.id)} className="p-1 text-slate-400 hover:text-amber-500 rounded" title="Edit"><Edit2 size={12} /></button>
                                    <button onClick={() => handleDelete('reply', comment.id, reply.id)} className="p-1 text-slate-400 hover:text-rose-500 rounded" title="Delete"><Trash2 size={12} /></button>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl rounded-tl-none border border-slate-100 break-words">
                              {renderTextWithMentions(reply.text)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="relative pt-4 border-t border-slate-100">
        {(replyingTo || editingId) && (
          <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-t-xl mb-[-4px] relative z-0">
            <span className="text-xs font-bold text-indigo-700">
              {editingId ? "Editing comment..." : `Replying to ${replyingTo.userName}...`}
            </span>
            <button onClick={() => { setReplyingTo(null); setEditingId(null); setInputText(''); }} className="p-0.5 text-indigo-400 hover:text-indigo-700">
              <X size={14} />
            </button>
          </div>
        )}

        {showMentionMenu && filteredEmployees.length > 0 && (
          <div className="absolute bottom-[100%] mb-2 left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-20">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">Mentions</span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredEmployees.map(emp => (
                <button 
                  key={emp.id} 
                  type="button"
                  onClick={() => insertMention(emp.name)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <img src={emp.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-sm font-bold text-slate-700">{emp.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!taskId}
            placeholder={!taskId ? "Select a team to enable comments..." : "Type your message... use @ to mention"}
            className="w-full bg-transparent border-none focus:ring-0 resize-none px-2 py-1 text-sm font-medium text-slate-800 placeholder-slate-400 custom-scrollbar disabled:opacity-50"
            rows="2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          {attachment && !editingId && (
            <div className="mx-2 mb-2 p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between w-max shadow-sm">
              <div className="flex items-center gap-2">
                {attachment.type === 'image' ? <ImageIcon size={14} className="text-blue-500"/> : <FileText size={14} className="text-slate-500"/>}
                <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{attachment.name}</span>
              </div>
              <button type="button" onClick={() => setAttachment(null)} className="ml-3 text-slate-400 hover:text-red-500 p-0.5 rounded-full hover:bg-red-50 transition-colors">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center px-2 pb-1">
            <div className="flex items-center gap-1">
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleAttachFile}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Attach File"
                disabled={!!editingId || !taskId}
              >
                <Paperclip size={18} />
              </button>
            </div>
            <button 
              type="submit" 
              disabled={(!inputText.trim() && !attachment) || !taskId}
              className="p-2 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center justify-center"
            >
              <Send size={16} className={inputText.trim() || attachment ? "ml-1" : ""} />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
