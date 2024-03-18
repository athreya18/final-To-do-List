import axios from "axios";

export const createNewTask = async (title: string, desc: string) => {
    console.log("1111111111111")
    try {
      const resp = await axios.post('http://localhost:3001/api/todos', { title:title, description: desc });
      return {data: resp};
    } catch (error) {
        console.error('Error creating task:', error);
        return {error}
    }
};
