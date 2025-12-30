import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
    request : Request, 
    props: {params: Promise<{ id: string }> } 
) {
    
    // Extract ID and validate it:
    const { id }= await props.params;
    if(!id) {
        return NextResponse.json( { message : "ID Unavailable"}, { status: 404} );
    }

    const isTestMode = process.env.TEST_MODE === "1";
    const testNowHeader = request.headers.get("x-test-now-ms");

    const now =
    isTestMode && testNowHeader
      ? new Date(Number(testNowHeader))
      : new Date();

    try{
        const result = await pool.query( 
            `SELECT * FROM pastes WHERE id = $1`,[id]
        );

        if (result.rows.length === 0) {
             return NextResponse.json(
            {message: "Not found"},
            {status: 404}
        );
    }
        const paste = result.rows[0];

        // Time expiry check
        if (paste.expires_at && new Date(paste.expires_at) < now) {
            return NextResponse.json(
            {message: "Not found"},
            {status: 404}
            );
        }
               
        // Atomic view decrement
    if (paste.remaining_views !== null) {
      const update = await pool.query(
        `UPDATE pastes
         SET remaining_views = remaining_views - 1
         WHERE id = $1 AND remaining_views > 0`,
        [id]
      );

      if (update.rowCount === 0) {
        return NextResponse.json(
          { message: "Not found" },
          { status: 404 }
        );
      }

      paste.remaining_views -= 1;
    }
        return NextResponse.json(
        {   
            content: paste.content ,
            remaining_views : paste.remaining_views,
            expires_at : paste.expires_at 
        },
        { status:200 }
    );
    } catch {
        return NextResponse.json(
            {message: "Server error"},
            {status: 500}
        );
    }
}