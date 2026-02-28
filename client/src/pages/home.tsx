import { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Activity, 
  Users, 
  LayoutDashboard, 
  Settings, 
  Search, 
  Plus, 
  MoreVertical,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// --- Mock Data ---
const MOCK_PATIENTS = [
  {
    id: "P-1001",
    name: "Eleanor Rigby",
    age: 68,
    condition: "Post-Op Knee Replacement",
    status: "active",
    activationScore: 85,
    avatar: "https://i.pravatar.cc/150?u=eleanor"
  },
  {
    id: "P-1002",
    name: "James Holden",
    age: 54,
    condition: "Type 2 Diabetes Management",
    status: "at-risk",
    activationScore: 42,
    avatar: "https://i.pravatar.cc/150?u=james"
  },
  {
    id: "P-1003",
    name: "Penny Lane",
    age: 41,
    condition: "Hypertension",
    status: "active",
    activationScore: 92,
    avatar: "https://i.pravatar.cc/150?u=penny"
  },
  {
    id: "P-1004",
    name: "Jude Martin",
    age: 72,
    condition: "Cardiac Rehab",
    status: "needs-attention",
    activationScore: 60,
    avatar: "https://i.pravatar.cc/150?u=jude"
  }
];

const MOCK_OBJECTIVES = [
  { id: 1, title: "Complete initial physical therapy assessment", patient: "Eleanor Rigby", dueDate: "Today", completed: true, type: "physical" },
  { id: 2, title: "Log morning blood glucose level", patient: "James Holden", dueDate: "Today", completed: false, type: "monitoring" },
  { id: 3, title: "Read educational module: Managing diet", patient: "James Holden", dueDate: "Tomorrow", completed: false, type: "education" },
  { id: 4, title: "Attend 30-min brisk walk", patient: "Jude Martin", dueDate: "Tomorrow", completed: false, type: "physical" },
  { id: 5, title: "Review discharge medication list", patient: "Eleanor Rigby", dueDate: "Yesterday", completed: true, type: "education" },
];

export default function Home() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [objectives, setObjectives] = useState(MOCK_OBJECTIVES);

  const toggleObjective = (id: number) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, completed: !obj.completed } : obj
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      case 'at-risk': return 'bg-rose-100 text-rose-700 hover:bg-rose-200';
      case 'needs-attention': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Activity className="w-6 h-6" />
            <span>ActiTrack</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-2 px-2">Menu</div>
          <Button variant="ghost" className="w-full justify-start text-slate-600 bg-slate-100/50" data-testid="nav-dashboard">
            <LayoutDashboard className="w-5 h-5 mr-3 text-primary" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-900" data-testid="nav-patients">
            <Users className="w-5 h-5 mr-3" />
            Patients
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-900" data-testid="nav-objectives">
            <CheckCircle2 className="w-5 h-5 mr-3" />
            All Objectives
          </Button>
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-8 px-2">System</div>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-900" data-testid="nav-settings">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=dr_smith" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Dr. Sarah Smith</p>
              <p className="text-xs text-slate-500">Care Coordinator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center w-full max-w-md relative">
            <Search className="w-5 h-5 absolute left-3 text-slate-400" />
            <Input 
              placeholder="Search patients, objectives..." 
              className="pl-10 bg-slate-50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary/50"
              data-testid="input-search"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative text-slate-500 rounded-full border-slate-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
            </Button>
            <Button className="rounded-full shadow-sm shadow-primary/20" data-testid="button-add-patient">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Overview Stats */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-6">Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Total Patients</p>
                      <h3 className="text-3xl font-bold text-slate-900">124</h3>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Avg Activation Score</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-slate-900">76</h3>
                        <span className="text-sm text-emerald-600 font-medium">+2.4%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Pending Objectives</p>
                      <h3 className="text-3xl font-bold text-slate-900">38</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Objectives */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-4 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900">Today's Objectives</CardTitle>
                      <CardDescription>Activation tasks requiring attention across your patients</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">View All</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {objectives.map((obj) => (
                        <div key={obj.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                          <button 
                            onClick={() => toggleObjective(obj.id)}
                            className={`mt-1 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              obj.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'
                            }`}
                            data-testid={`button-toggle-objective-${obj.id}`}
                          >
                            {obj.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${obj.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                              {obj.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="font-medium text-slate-700">{obj.patient}</span>
                              <span>•</span>
                              <span className={obj.dueDate === 'Today' && !obj.completed ? 'text-amber-600 font-medium' : ''}>
                                Due {obj.dueDate}
                              </span>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Patients List */}
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">Priority Patients</CardTitle>
                    <CardDescription>Patients requiring immediate follow-up</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {MOCK_PATIENTS.map((patient) => (
                        <div 
                          key={patient.id} 
                          className={`p-4 flex items-center gap-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                            selectedPatientId === patient.id ? 'bg-primary/5 border-l-2 border-primary' : 'border-l-2 border-transparent'
                          }`}
                          onClick={() => setSelectedPatientId(patient.id)}
                          data-testid={`row-patient-${patient.id}`}
                        >
                          <Avatar className="w-10 h-10 border border-slate-100 shadow-sm">
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-slate-900 truncate">{patient.name}</p>
                              <span className="text-xs font-semibold text-slate-600">{patient.activationScore} / 100</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-slate-500 truncate pr-2">{patient.condition}</p>
                              <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 rounded ${getStatusColor(patient.status)}`}>
                                {getStatusLabel(patient.status)}
                              </Badge>
                            </div>
                            {/* Mini progress bar for activation score */}
                            <Progress 
                              value={patient.activationScore} 
                              className="h-1.5 mt-2 bg-slate-100" 
                              indicatorClassName={
                                patient.activationScore > 80 ? 'bg-emerald-500' : 
                                patient.activationScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-4 border-t border-slate-50 bg-slate-50/50 text-center">
                    <Button variant="link" size="sm" className="text-primary h-auto p-0">View All 124 Patients</Button>
                  </div>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
