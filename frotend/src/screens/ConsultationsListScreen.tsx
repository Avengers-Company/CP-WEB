import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

interface Consultation {
  id: number;
  date: string;
  doctor: string;
  specialty: string;
  status: string;
  username: string;
}

const ConsultationsListScreen = ({ userId, role }: { userId: number; role: string }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    console.log(`Fetching consultations for userId: ${userId} and role: ${role}`);
    
    axios.get(`http://localhost:3000/api/consultations?userId=${userId}&role=${role}`)
      .then((response) => {
        console.log('Consultations response:', response.data);
        setConsultations(response.data.consultations);
      })
      .catch((error) => {
        console.error('Erro ao buscar consultas:', error);
      });
  }, [userId, role]);

  const renderItem = ({ item }: { item: Consultation }) => (
    <View style={styles.consultationItem}>
      <Text>Paciente: {item.username}</Text>
      <Text>Data: {item.date}</Text>
      <Text>Médico: {item.doctor}</Text>
      <Text>Especialidade: {item.specialty}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={consultations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  consultationItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
});

export default ConsultationsListScreen;
