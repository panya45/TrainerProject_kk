import db from "@/app/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = params; // ดึง `id` จาก params (จาก URL)
  
    // ทำการ query ฐานข้อมูล
    const [trainers] = await db.query(
      "SELECT * FROM Trainer WHERE trainer_id = ?", [id]
    );

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (!trainers || trainers.length === 0) {
      return new Response(
        JSON.stringify({ message: "ไม่พบข้อมูลสำหรับ trainer id นี้" }),
        { status: 404 }
      );
    }

    // ส่งข้อมูลที่พบกลับ
    return new Response(JSON.stringify(trainers[0]), { status: 200 });  // trainers[0] เพราะ query จะได้ array ของผลลัพธ์
  } catch (error) {
    console.error("Error fetching trainer data:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params; // Directly destructure `id` from `params`

    // Perform the DELETE query
    const [trainers] = await db.query(
      "DELETE FROM Trainer WHERE trainer_id = ?",
      [id] // Pass id inside an array for parameterized queries
    );

    // If no rows were affected, return a response indicating no trainer was found
    if (trainers.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "ไม่พบไอดีนี้ในฐานข้อมูล" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // If rows were affected, return the result
    return new Response(JSON.stringify({ message: "ลบข้อมูลสำเร็จ" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const trainer_id = Number(params.id); // Get trainer_id from the URL

    // Get the request body data
    const { 
      trainer_name, 
      trainer_surname, 
      trainer_email, 
      trainer_password, 
      trainer_phone, 
      trainer_birthdate, 
      trainer_gender, 
      trainer_exp, 
      trainer_status, 
      trainer_startdate, 
      trainer_endtdate 
    } = await request.json();

    // Log the incoming data (for debugging purposes)
    console.log({
      trainer_name,
      trainer_surname,
      trainer_email,
      trainer_password,
      trainer_phone,
      trainer_birthdate,
      trainer_gender,
      trainer_exp,
      trainer_status,
      trainer_startdate,
      trainer_endtdate,
    });

    // Check if the trainer exists in the database
    const [trainers_by_id] = await db.query(
      "SELECT * FROM Trainer WHERE trainer_id = ?",
      [trainer_id]
    );

    // If no trainer was found, return a 404 error
    if (trainers_by_id.length === 0) {
      return new Response(
        JSON.stringify({ message: "ไม่พบไอดีนี้ในฐานข้อมูล" }),
        { status: 404 } // Return 404 for not found
      );
    }

    // Update the trainer details in the database
    const [new_trainers] = await db.query(
      "UPDATE Trainer SET trainer_name = ?, trainer_surname = ?, trainer_email = ?, trainer_password = ?, trainer_phone = ?, trainer_birthdate = ?, trainer_gender = ?, trainer_exp = ?, trainer_status = ?, trainer_startdate = ?, trainer_endtdate = ? WHERE trainer_id = ?",
      [
        trainer_name, 
        trainer_surname, 
        trainer_email, 
        trainer_password, 
        trainer_phone, 
        trainer_birthdate, 
        trainer_gender, 
        trainer_exp, 
        trainer_status, 
        trainer_startdate, 
        trainer_endtdate, 
        trainer_id // ใส่ trainer_id เพื่อระบุว่าเราจะอัปเดตข้อมูลของ trainer นี้
      ]
    );

    // Check if the update was successful (affectedRows > 0)
    if (new_trainers.affectedRows > 0) {
      return new Response(
        JSON.stringify({ message: "Trainer updated successfully" }),
        { status: 200 } // Return 200 OK for success
      );
    } else {
      // If no rows were affected, handle the case
      return new Response(
        JSON.stringify({ message: "No changes made to the trainer" }),
        { status: 400 } // Return 400 Bad Request if no rows were updated
      );
    }
  } catch (err) {
    // Handle any errors that occur during the process
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
