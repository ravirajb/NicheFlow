-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for users
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT
    USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for clients
CREATE POLICY "Users can view their own clients" ON public.clients
    FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can create clients" ON public.clients
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients" ON public.clients
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('draft', 'active', 'completed', 'archived')) DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for projects
CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = projects.client_id 
        AND clients.user_id = auth.uid()
    ));
CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = client_id 
        AND clients.user_id = auth.uid()
    ));
CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = client_id 
        AND clients.user_id = auth.uid()
    ));

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('todo', 'in_progress', 'for_review', 'awaiting_feedback', 'done')) DEFAULT 'todo',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = tasks.project_id 
        AND EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = projects.client_id 
            AND clients.user_id = auth.uid()
        )
    ));
CREATE POLICY "Users can create tasks" ON public.tasks
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_id 
        AND EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = projects.client_id 
            AND clients.user_id = auth.uid()
        )
    ));

-- Communications table
CREATE TABLE IF NOT EXISTS public.communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id),
    type TEXT CHECK (type IN ('email', 'call', 'meeting', 'note')) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for communications
CREATE POLICY "Users can view their own communications" ON public.communications
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = communications.project_id 
        AND EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = projects.client_id 
            AND clients.user_id = auth.uid()
        )
    ));

-- Project files table
CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for project files
CREATE POLICY "Users can view their own files" ON public.project_files
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_files.project_id 
        AND EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = projects.client_id 
            AND clients.user_id = auth.uid()
        )
    ));

-- Time entries table
CREATE TABLE IF NOT EXISTS public.time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    project_id UUID REFERENCES public.projects(id),
    task_id UUID REFERENCES public.tasks(id),
    date DATE NOT NULL,
    hours NUMERIC(5,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for time entries
CREATE POLICY "Users can view their own time entries" ON public.time_entries
    FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can create time entries" ON public.time_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id),
    client_id UUID REFERENCES public.clients(id),
    invoice_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id),
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for invoices
CREATE POLICY "Users can view their own invoices" ON public.invoices
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = invoices.client_id 
        AND clients.user_id = auth.uid()
    ));
CREATE POLICY "Users can create invoices" ON public.invoices
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = client_id 
        AND clients.user_id = auth.uid()
    ));

-- Enable RLS for invoice items
CREATE POLICY "Users can view their own invoice items" ON public.invoice_items
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.invoices 
        WHERE invoices.id = invoice_items.invoice_id 
        AND EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = invoices.client_id 
            AND clients.user_id = auth.uid()
        )
    ));
