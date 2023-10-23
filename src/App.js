import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { listEmployees } from "./graphql/queries";
import {
  createEmployee as createEmpoyeeMutation,
  deleteEmployee as deleteEmployeeMutation,
} from "./graphql/mutations";


const  App=({ signOut })=> {

  const [employees, setEmployees]=useState([]);

  useEffect(()=>{
    fetchEmployees();
},[]);


async function fetchEmployees(){
  const apiData = await API.graphql({query: listEmployees })
  const employeesFromAPI= apiData.data.listEmployees.items;
  setEmployees(employeesFromAPI);
}

async function createEmployee(event){
  event.preventDefault();
  const form= new FormData(event.target);
  const data={
    name: form.get("name"),
    role: form.get("role"),
    mobileno: form.get("mobileno"),
  };
  await API.graphql({
    query:createEmpoyeeMutation,
    variables:{input:data},
  });
  fetchEmployees();
  event.target.reset();
}

async function deleteEmployee({id}){
  const newEmployee= employees.filter((employee)=>employee.id!==id) ;
  setEmployees(newEmployee);
  await API.graphql({
    query: deleteEmployeeMutation,
    variables:{input:{id}},
  })
}


  return (
    <View className="Employee">
    <Heading level={1}>My Employees Details APP</Heading>
    <View as="form" margin="3rem 0" onSubmit={createEmployee}>

    <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Employee Name"
            text={'\n'}
            label="Employee Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="role"
            placeholder="Employee Role"
            text={'\n'}
            label="Employee Role"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="mobileno"
            placeholder="Employee mobileNo"
            text={'\n'}
            label="Employee mobileNo"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Employee
          </Button>
          </Flex>
    </View>
    <Heading level={2}>Current Employees</Heading>
      <View margin="3rem 0">
        {employees.map((employee) => (
          <Flex
            key={employee.id || employee.name || employee.mobileno}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {employee.name}
            </Text>
            <Text as="span">{employee.role}</Text>
            <Text as="span">{employee.mobileno}</Text>
            <Button variation="link" onClick={() => deleteEmployee(employee)}>
              Delete Employee
            </Button>
          </Flex>
        ))}
      </View>
      
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);