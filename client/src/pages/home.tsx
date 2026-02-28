import { useState } from "react";
import { 
  ListTodo,
  Calendar,
  Settings, 
  Search, 
  Plus, 
  MoreVertical,
  Bell,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

// --- Mock Data ---
const MOCK_OBJECTIVES = [
  { id: 1, title: "Standardize post-op knee replacement physical therapy protocol", category: "Physical Therapy", targetDate: "2024-03-15", status: "in-progress", priority: "high" },
  { id: 2, title: "Develop automated SMS reminders for morning blood glucose logging", category: "Monitoring", targetDate: "2024-03-20", status: "pending", priority: "medium" },
  { id: 3, title: "Create new patient education module on managing diet for Type 2 Diabetes", category: "Education", targetDate: "2024-04-01", status: "pending", priority: "medium" },
  { id: 4, title: "Implement tracking for '30-min brisk walk' cardiac rehab adherence", category: "Physical Therapy", targetDate: "2024-03-10", status: "completed", priority: "high" },
  { id: 5, title: "Review and update standard discharge medication list handouts", category: "Education", targetDate: "2024-02-28", status: "completed", priority: "low" },
  { id: 6, title: "Integrate continuous glucose monitor data into main dashboard", category: "Integration", targetDate: "2024-05-15", status: "pending", priority: "high" },
  { id: 7, title: "Establish baseline activation scores for all new admissions in Q2", category: "Assessment", targetDate: "2024-06-30", status: "in-progress", priority: "high" },
];

export default function Home() {
  const [objectives, setObjectives] = useState(MOCK_OBJECTIVES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [newTargetDate, setNewTargetDate] = useState("");

  const handleAddObjective = () => {
    if (!newTitle || !newCategory || !newPriority || !newTargetDate) return;

    const newObj = {
      id: objectives.length + 1,
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      targetDate: newTargetDate,
      status: "pending"
    };

    setObjectives([newObj, ...objectives]);
    setIsAddModalOpen(false);
    
    // Reset form
    setNewTitle("");
    setNewCategory("");
    setNewPriority("");
    setNewTargetDate("");
  };

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
  }

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
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
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-900" data-testid="nav-calendar">
            <Calendar className="w-5 h-5 mr-3" />
            Timeline View
          </Button>
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-8 px-2">System</div>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-900" data-testid="nav-settings">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center w-full max-w-md relative">
            <Search className="w-5 h-5 absolute left-3 text-slate-400" />
            <Input 
              placeholder="Search objectives..." 
              className="pl-10 bg-slate-50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary/50"
              data-testid="input-search"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative text-slate-500 rounded-full border-slate-200">
              <Bell className="w-5 h-5" />
            </Button>
            
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
                    Define a new patient activation objective to track across the system.
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
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={newCategory} onValueChange={setNewCategory}>
                        <SelectTrigger>
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
                        <SelectTrigger>
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
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddObjective} disabled={!newTitle || !newCategory || !newPriority || !newTargetDate}>Save Objective</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Activation Objectives</h1>
                <p className="text-slate-500 mt-1">Manage and track system-wide patient activation goals.</p>
              </div>
              
              <div className="flex gap-2">
                 <Button variant="outline" className="bg-white" data-testid="button-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
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
                    {objectives.map((obj) => (
                      <tr key={obj.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{obj.title}</p>
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
                          {new Date(obj.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }, { timeZone: 'UTC' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {objectives.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          No objectives found. Click "New Objective" to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
