//
//  seed.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/21/26.
//


// scripts/seed.ts
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  try {
    // 1️⃣ Users
    const ownerId = process.env.SEED_OWNER_ID || uuidv4()
    const memberId = '11111111-1111-1111-1111-111111111111'
    const member2Id = '33333333-3333-3333-3333-333333333333'
    const outsiderId = '22222222-2222-2222-2222-222222222222'

    console.log('Owner ID:', ownerId)

    // 2️⃣ Workspaces
    const workspaceIds: string[] = []
    for (const name of ['Owner Workspace 1', 'Owner Workspace 2']) {
      const { data: ws, error } = await supabase
        .from('workspaces')
        .insert([{ id: uuidv4(), name, owner_id: ownerId }])
        .select()
        .single()
      if (error) throw error
      workspaceIds.push(ws.id)
    }

    console.log('Created workspaces:', workspaceIds)

    // 3️⃣ Members
    for (const wsId of workspaceIds) {
      for (const userId of [memberId, member2Id]) {
        const { error } = await supabase
          .from('workspace_members')
          .insert([{ workspace_id: wsId, user_id: userId, role: 'member' }])
        if (error) throw error
      }
    }

    console.log('Added members to workspaces')

    // 4️⃣ Projects
    const projectIds: string[] = []
    const projectMap: Record<string, string[]> = {}
    for (const wsId of workspaceIds) {
      projectMap[wsId] = []
      for (const projName of ['Starter Project 1', 'Starter Project 2']) {
        const { data: project, error } = await supabase
          .from('projects')
          .insert([{ id: uuidv4(), name: projName, owner_id: ownerId, workspace_id: wsId, description: 'Starter AI-generated app' }])
          .select()
          .single()
        if (error) throw error
        projectIds.push(project.id)
        projectMap[wsId].push(project.id)
      }
    }

    console.log('Created projects:', projectIds)

    // 5️⃣ Deployments
    const deploymentIds: string[] = []
    for (const wsId of workspaceIds) {
      for (const projectId of projectMap[wsId]) {
        const { data: deployment, error } = await supabase
          .from('deployments')
          .insert([{ id: uuidv4(), workspace_id: wsId, project_id: projectId, status: 'draft', created_by: ownerId }])
          .select()
          .single()
        if (error) throw error
        deploymentIds.push(deployment.id)

        // 6️⃣ Assign members to deployments (collaborators)
        for (const userId of [memberId, member2Id]) {
          const { error: memberError } = await supabase
            .from('deployment_members')
            .insert([{ deployment_id: deployment.id, user_id, role: 'collaborator' }])
          if (memberError) throw memberError
        }

        // 7️⃣ Seed onboarding tasks for deployment
        const onboardingTasks = ['Setup workspace', 'Create first page', 'Export ZIP', 'Push to GitHub']
        for (const task of onboardingTasks) {
          const { error: taskError } = await supabase
            .from('onboarding_tasks')
            .insert([{ deployment_id: deployment.id, name: task, completed: false, assigned_to: ownerId }])
          if (taskError) throw taskError
        }
      }
    }

    console.log('Created deployments with members and onboarding tasks')
    console.log('✅ Seed completed successfully!')
  } catch (err: any) {
    console.error('❌ Seed failed:', err.message)
  }
}

seed()
