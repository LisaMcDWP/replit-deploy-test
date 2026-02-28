import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  ListTodo,
  Search, 
  Plus, 
  MoreVertical,
  Bell,
  Filter,
  Trash2,
  Pencil,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Objective } from "@shared/schema";

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [newTargetDate, setNewTargetDate] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editTargetDate, setEditTargetDate] = useState("");

  const { data: objectives = [], isLoading } = useQuery<Objective[]>({
    queryKey: ["/api/objectives"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; category: string; priority: string; targetDate: string }) => {
      const res = await apiRequest("POST", "/api/objectives", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/objectives"] });
      setIsAddModalOpen(false);
      resetNewForm();
      toast({ title: "Objective created", description: "New activation objective has been added." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; title?: string; category?: string; priority?: string; status?: string; targetDate?: string }) => {
      const res = await apiRequest("PATCH", `/api/objectives/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/objectives"] });
      setIsEditModalOpen(false);
      setEditingObjective(null);
      toast({ title: "Objective updated", description: "Activation objective has been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/objectives/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/objectives"] });
      toast({ title: "Objective deleted", description: "Activation objective has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetNewForm = () => {
    setNewTitle("");
    setNewCategory("");
    setNewPriority("");
    setNewTargetDate("");
  };

  const handleAdd = () => {
    if (!newTitle || !newCategory || !newPriority || !newTargetDate) return;
    createMutation.mutate({ title: newTitle, category: newCategory, priority: newPriority, targetDate: newTargetDate });
  };

  const openEdit = (obj: Objective) => {
    setEditingObjective(obj);
    setEditTitle(obj.title);
    setEditCategory(obj.category);
    setEditPriority(obj.priority);
    setEditStatus(obj.status);
    setEditTargetDate(obj.targetDate);
    setIsEditModalOpen(true);
  };

  const handleEdit = () => {
    if (!editingObjective) return;
    updateMutation.mutate({
      id: editingObjective.id,
      title: editTitle,
      category: editCategory,
      priority: editPriority,
      status: editStatus,
      targetDate: editTargetDate,
    });
  };

  const filteredObjectives = objectives.filter((obj) => {
    const matchesSearch = obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "all" || obj.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'pending': return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-600 bg-rose-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-slate-600 bg-slate-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <ListTodo className="w-6 h-6" />
            <span>Activation Tracker</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-2 px-2">Menu</div>
          <Button variant="ghost" className="w-full justify-start text-slate-600 bg-slate-100/50" data-testid="nav-objectives">
            <ListTodo className="w-5 h-5 mr-3 text-primary" />
            Objectives List
          </Button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center w-full max-w-md relative">
            <Search className="w-5 h-5 absolute left-3 text-slate-400" />
            <Input 
              placeholder="Search objectives..." 
              className="pl-10 bg-slate-50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]" data-testid="select-filter-priority">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-sm shadow-primary/20" data-testid="button-add-objective">
                  <Plus className="w-4 h-4 mr-2" />
                  New Objective
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Objective</DialogTitle>
                  <DialogDescription>
                    Define a new patient activation objective to track.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Objective Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. Standardize physical therapy protocol" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      data-testid="input-new-title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={newCategory} onValueChange={setNewCategory}>
                        <SelectTrigger data-testid="select-new-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                          <SelectItem value="Monitoring">Monitoring</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Integration">Integration</SelectItem>
                          <SelectItem value="Assessment">Assessment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newPriority} onValueChange={setNewPriority}>
                        <SelectTrigger data-testid="select-new-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input 
                      id="targetDate" 
                      type="date"
                      value={newTargetDate}
                      onChange={(e) => setNewTargetDate(e.target.value)}
                      data-testid="input-new-target-date"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleAdd} 
                    disabled={!newTitle || !newCategory || !newPriority || !newTargetDate || createMutation.isPending}
                    data-testid="button-save-objective"
                  >
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Objective
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Activation Objectives</h1>
                <p className="text-slate-500 mt-1">Manage and track system-wide patient activation goals.</p>
              </div>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-slate-500">Loading objectives from BigQuery...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-medium">Objective Title</th>
                        <th className="px-6 py-4 font-medium">Category</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Priority</th>
                        <th className="px-6 py-4 font-medium">Target Date</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredObjectives.map((obj) => (
                        <tr key={obj.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-900" data-testid={`text-title-${obj.id}`}>{obj.title}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-600">{obj.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className={`font-medium ${getStatusColor(obj.status)}`}>
                              {getStatusLabel(obj.status)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(obj.priority)}`}>
                              {obj.priority.charAt(0).toUpperCase() + obj.priority.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {new Date(obj.targetDate + "T00:00:00").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600" data-testid={`button-actions-${obj.id}`}>
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEdit(obj)} data-testid={`button-edit-${obj.id}`}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteMutation.mutate(obj.id)} 
                                  className="text-destructive focus:text-destructive"
                                  data-testid={`button-delete-${obj.id}`}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                      {filteredObjectives.length === 0 && !isLoading && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            {searchQuery ? "No objectives match your search." : "No objectives yet. Click \"New Objective\" to add one."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Objective</DialogTitle>
            <DialogDescription>
              Update the activation objective details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Objective Title</Label>
              <Input 
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                data-testid="input-edit-title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger data-testid="select-edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Integration">Integration</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger data-testid="select-edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={editPriority} onValueChange={setEditPriority}>
                  <SelectTrigger data-testid="select-edit-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Target Date</Label>
                <Input 
                  type="date"
                  value={editTargetDate}
                  onChange={(e) => setEditTargetDate(e.target.value)}
                  data-testid="input-edit-target-date"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEdit} 
              disabled={updateMutation.isPending}
              data-testid="button-update-objective"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Objective
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
