
export default function teacher(userId) {
    return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
}
