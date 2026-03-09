//
//  AI_App_Builder_ProApp.swift
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//

import SwiftUI
import SwiftData

@main
struct AI_App_Builder_ProApp: App {
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            Item.self,
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(sharedModelContainer)
    }
}
