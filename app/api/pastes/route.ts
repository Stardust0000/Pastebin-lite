import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
    
    // Getting JSON object:
    const contentObj = await request.json();

    // To access the body inside JSON object:
    // var to store = Object.fieldName
    const content = typeof contentObj.content === "string"? contentObj.content.trim() : "";

    // Check content validity:
    if(!content) {
        return NextResponse.json(
            { message : 'Invalid Content' }, { status: 400 });
    }
  
    const id = randomUUID();

    // Query to insert values from object:
    try {
        await pool.query(` INSERT INTO pastes (id, content, expires_at, remaining_views) Values($1,$2,$3,$4) `, [id, content, null, null]
        );
    } catch {
        return NextResponse.json(
            {message: "Database error"},
            {status: 400}
        );
    }

    // Respond to user:
    return NextResponse.json(
        {   
            id ,
            url: `/p/${id}` 
        },
        { status:201 }
    );
}
