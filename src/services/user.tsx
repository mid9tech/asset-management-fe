import axios from 'axios';

const CREATE_USER_MUTATION = `
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      firstName
      lastName
      gender
      joinedDate
      dateOfBirth
      type
    }
  }
`;

const createUser = async (
  firstName: string,
  lastName: string,
  gender: string,
  joinedDate: string,
  dateOfBirth: string,
  type: string
): Promise<any> => {
  const userData = {
    query: CREATE_USER_MUTATION,
    variables: {
      createUserInput: {
        firstName,
        lastName,
        gender,
        joinedDate,
        dateOfBirth,
        type
      }
    }
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`, 
    }
  };

  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL as string, userData, config);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export default createUser;
