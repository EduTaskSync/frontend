import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { KanbanSquare, Calendar, Users, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router';

const LandingPage = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b border-border/30">
        <div className="container mx-auto px-4 py-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <KanbanSquare className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-heading font-bold">
              EduTask
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Sync</span>
            </h1>
          </div>
          <Button
            onClick={() => login()}
            variant="outline"
            className="font-heading border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
          >
            Sign In
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Content */}
        <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
              Organize Your <span className="text-primary">Academic Projects</span> With Ease
            </h2>
            <p className="text-lg text-muted-foreground">
              EduTaskSync helps students collaborate efficiently, manage tasks seamlessly, and meet deadlines
              consistently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" onClick={() => login()} className="font-heading cursor-pointer">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="font-heading hover:bg-primary/10 cursor-pointer">
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="rounded-lg bg-card border border-border/50 shadow-lg overflow-hidden p-2">
              <div className="bg-gradient-to-br from-primary/10 to-card rounded-md p-4 aspect-video flex items-center justify-center">
                <div className="grid grid-cols-2 gap-3 w-full">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-background/80 rounded-md p-3 border border-border/30 shadow-sm h-24">
                      <div className="h-3 w-1/2 bg-primary/20 rounded-full mb-2" />
                      <div className="h-2 w-3/4 bg-muted rounded-full mb-2" />
                      <div className="h-2 w-1/2 bg-muted rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-center mb-12">
              Everything You Need for Academic Success
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<KanbanSquare className="h-8 w-8 text-emerald-400" />}
                title="Kanban Boards"
                description="Visualize your workflow with customizable boards for tracking task progress."
              />
              <FeatureCard
                icon={<Calendar className="h-8 w-8 text-blue-400" />}
                title="Deadline Management"
                description="Never miss a deadline with intuitive calendar views and reminders."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-violet-400" />}
                title="Team Collaboration"
                description="Work together seamlessly with group projects and task assignments."
              />
            </div>
          </div>
        </section>

        {/* Testimonial/How it Works Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-6">How EduTaskSync Works</h3>
              <div className="space-y-6">
                <StepItem number="1" title="Create a Group" description="Invite classmates and form project groups." />
                <StepItem
                  number="2"
                  title="Add Projects"
                  description="Set up projects with clear deadlines and objectives."
                />
                <StepItem
                  number="3"
                  title="Manage Tasks"
                  description="Break down projects into manageable tasks and assign them."
                />
                <StepItem
                  number="4"
                  title="Track Progress"
                  description="Monitor your team's progress and meet deadlines."
                />
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-6">
                <div className="flex gap-2 mb-4">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">STUDENT TESTIMONIAL</span>
                </div>
                <p className="text-lg italic mb-6">
                  "EduTaskSync transformed how our study group collaborates. We've improved our productivity and haven't
                  missed a single deadline since we started using it."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">Jamie Davis</p>
                    <p className="text-sm text-muted-foreground">Computer Science Student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary/20 via-background to-primary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              Ready to Boost Your Academic Productivity?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of students who are already managing their academic projects more effectively.
            </p>
            <Button size="lg" onClick={() => login()} className="font-heading hover:bg-primary/10 cursor-pointer">
              Get Started For Free
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <KanbanSquare className="h-5 w-5 text-primary" />
              <p className="text-sm font-heading">EduTaskSync &copy; {new Date().getFullYear()}</p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/">Home</Link>
              <Link to="/">Features</Link>
              <Link to="/">About</Link>
              <Link to="/">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-card border border-border/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h4 className="text-xl font-heading font-semibold mb-2">{title}</h4>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

interface StepItemProps {
  number: string;
  title: string;
  description: string;
}

const StepItem = ({ number, title, description }: StepItemProps) => (
  <div className="flex gap-4">
    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">
      {number}
    </div>
    <div>
      <h4 className="font-heading font-medium mb-1">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);
export default LandingPage;
