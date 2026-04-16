// // src/screens/ProfileScreen.js
// import React, { useState } from 'react';
// import { View, StyleSheet, ScrollView, Alert } from 'react-native';
// import { Card, Title, Text, Button, List, Avatar, Divider } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useAuth } from '../context/AuthContext';

// const ProfileScreen = ({ navigation }) => {
//   const { user, logout } = useAuth();

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await logout();
//           }
//         }
//       ]
//     );
//   };

//   const getInitials = () => {
//     if (!user?.name) return 'U';
//     return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Avatar.Text
//           size={80}
//           label={getInitials()}
//           style={styles.avatar}
//         />
//         <Title style={styles.name}>{user?.name || 'User'}</Title>
//         <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
//         {user?.farmLocation && (
//           <View style={styles.locationRow}>
//             <Icon name="map-marker" size={16} color="#6b7280" />
//             <Text style={styles.location}>{user.farmLocation}</Text>
//           </View>
//         )}
//       </View>

//       <Card style={styles.card}>
//         <Card.Content>
//           <Title>Account Information</Title>
//           <List.Item
//             title="Name"
//             description={user?.name}
//             left={props => <List.Icon {...props} icon="account" />}
//           />
//           <Divider />
//           <List.Item
//             title="Email"
//             description={user?.email}
//             left={props => <List.Icon {...props} icon="email" />}
//           />
//           <Divider />
//           <List.Item
//             title="Farm Location"
//             description={user?.farmLocation || 'Not set'}
//             left={props => <List.Icon {...props} icon="map-marker" />}
//           />
//           <Divider />
//           <List.Item
//             title="Role"
//             description={user?.role || 'Farmer'}
//             left={props => <List.Icon {...props} icon="briefcase" />}
//           />
//         </Card.Content>
//       </Card>

//       <Card style={styles.card}>
//         <Card.Content>
//           <Title>App Settings</Title>
//           <List.Item
//             title="Notifications"
//             description="Manage your notifications"
//             left={props => <List.Icon {...props} icon="bell" />}
//             right={props => <List.Icon {...props} icon="chevron-right" />}
//             onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}
//           />
//           <Divider />
//           <List.Item
//             title="Language"
//             description="English"
//             left={props => <List.Icon {...props} icon="translate" />}
//             right={props => <List.Icon {...props} icon="chevron-right" />}
//             onPress={() => Alert.alert('Coming Soon', 'Language settings will be available soon')}
//           />
//           <Divider />
//           <List.Item
//             title="Data & Storage"
//             description="Manage offline data"
//             left={props => <List.Icon {...props} icon="database" />}
//             right={props => <List.Icon {...props} icon="chevron-right" />}
//             onPress={() => Alert.alert('Coming Soon', 'Storage settings will be available soon')}
//           />
//         </Card.Content>
//       </Card>

//       <Card style={styles.card}>
//         <Card.Content>
//           <Title>Support</Title>
//           <List.Item
//             title="Help Center"
//             description="Get help and support"
//             left={props => <List.Icon {...props} icon="help-circle" />}
//             right={props => <List.Icon {...props} icon="chevron-right" />}
//             onPress={() => Alert.alert('Help Center', 'Contact support at support@livestockcare.com')}
//           />
//           <Divider />
//           <List.Item
//             title="Privacy Policy"
//             left={props => <List.Icon {...props} icon="shield-check" />}
//             right={props => <List.Icon {...props} icon="chevron-right" />}
//             onPress={() => Alert.alert('Privacy Policy', 'View our privacy policy online')}
//           />
//           <Divider />
//           <List.Item
//             title="Terms of Service"
//             left={props => <List.Icon {...props} icon="file-document" />}
//             right={props => <List.Icon {...props} icon="chevron-right" />}
//             onPress={() => Alert.alert('Terms of Service', 'View our terms online')}
//           />
//           <Divider />
//           <List.Item
//             title="About"
//             description="Version 1.0.0"
//             left={props => <List.Icon {...props} icon="information" />}
//             right={props => <List.Icon {...props} icon="chevron-right" />}
//           />
//         </Card.Content>
//       </Card>

//       <View style={styles.actions}>
//         <Button
//           mode="outlined"
//           icon="account-edit"
//           onPress={() => Alert.alert('Coming Soon', 'Edit profile will be available soon')}
//           style={styles.button}
//         >
//           Edit Profile
//         </Button>
//         <Button
//           mode="contained"
//           icon="logout"
//           onPress={handleLogout}
//           style={styles.button}
//           buttonColor="#ef4444"
//         >
//           Logout
//         </Button>
//       </View>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>LivestockCare AI</Text>
//         <Text style={styles.footerSubtext}>© 2025 All Rights Reserved</Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f3f4f6'
//   },
//   header: {
//     backgroundColor: '#16a34a',
//     padding: 32,
//     alignItems: 'center'
//   },
//   avatar: {
//     backgroundColor: '#fff',
//     marginBottom: 16
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 4
//   },
//   email: {
//     fontSize: 16,
//     color: '#dcfce7',
//     marginBottom: 8
//   },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4
//   },
//   location: {
//     fontSize: 14,
//     color: '#dcfce7'
//   },
//   card: {
//     margin: 16,
//     marginBottom: 8,
//     elevation: 2
//   },
//   actions: {
//     padding: 16,
//     gap: 12
//   },
//   button: {
//     paddingVertical: 6
//   },
//   footer: {
//     padding: 32,
//     alignItems: 'center'
//   },
//   footerText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#6b7280',
//     marginBottom: 4
//   },
//   footerSubtext: {
//     fontSize: 12,
//     color: '#9ca3af'
//   }
// });

// export default ProfileScreen;



// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, List, Avatar, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={getInitials()}
          style={styles.avatar}
        />
        <Title style={styles.name}>{user?.name || 'User'}</Title>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        {user?.farmLocation && (
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={16} color="#6b7280" />
            <Text style={styles.location}>{user.farmLocation}</Text>
          </View>
        )}
      </View>
      <ScrollView>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Account Information</Title>
          <List.Item
            title="Name"
            description={user?.name}
            left={props => <List.Icon {...props} icon="account" />}
          />
          <Divider />
          <List.Item
            title="Email"
            description={user?.email}
            left={props => <List.Icon {...props} icon="email" />}
          />
          <Divider />
          <List.Item
            title="Farm Location"
            description={user?.farmLocation || 'Not set'}
            left={props => <List.Icon {...props} icon="map-marker" />}
          />
          <Divider />
          <List.Item
            title="Role"
            description={user?.role || 'Farmer'}
            left={props => <List.Icon {...props} icon="briefcase" />}
          />
        </Card.Content>
      </Card>

      {/* Role-based actions */}
      {user?.role === 'farmer' && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Veterinary</Title>
            <List.Item
              title="Apply as Veterinarian"
              description="Submit your professional details for review"
              left={props => <List.Icon {...props} icon="stethoscope" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('VetApplication')}
            />
          </Card.Content>
        </Card>
      )}

      {user?.role === 'vet' && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Veterinary</Title>
            <List.Item
              title="Vet Dashboard"
              description="View and manage your consultations"
              left={props => <List.Icon {...props} icon="view-dashboard" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('VetDashboard')}
            />
          </Card.Content>
        </Card>
      )}

      {user?.role === 'admin' && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Admin</Title>
            <List.Item
              title="Vet Approvals"
              description="Review and approve vet applications"
              left={props => <List.Icon {...props} icon="shield-check" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('AdminVetApprovals')}
            />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>App Settings</Title>
          <List.Item
            title="Notifications"
            description="Manage your notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}
          />
          <Divider />
          <List.Item
            title="Language"
            description="English"
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Language settings will be available soon')}
          />
          <Divider />
          <List.Item
            title="Data & Storage"
            description="Manage offline data"
            left={props => <List.Icon {...props} icon="database" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Storage settings will be available soon')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Support</Title>
          <List.Item
            title="Help Center"
            description="Get help and support"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Help Center', 'Contact support at support@livestockcare.com')}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-check" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Privacy Policy', 'View our privacy policy online')}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Terms of Service', 'View our terms online')}
          />
          <Divider />
          <List.Item
            title="About"
            description="Version 1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          icon="account-edit"
          onPress={() => Alert.alert('Coming Soon', 'Edit profile will be available soon')}
          style={styles.button}
        >
          Edit Profile
        </Button>
        <Button
          mode="contained"
          icon="logout"
          onPress={handleLogout}
          style={styles.button}
          buttonColor="#ef4444"
        >
          Logout
        </Button>
      </View>
      

      <View style={styles.footer}>
        <Text style={styles.footerText}>Mifugo</Text>
        <Text style={styles.footerSubtext}>© 2025 All Rights Reserved</Text>
      </View>
      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  header: {
    backgroundColor: '#16a34a',
    padding: 32,
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: '#fff',
    marginBottom: 16
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  email: {
    fontSize: 16,
    color: '#dcfce7',
    marginBottom: 8
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  location: {
    fontSize: 14,
    color: '#dcfce7'
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2
  },
  actions: {
    padding: 16,
    gap: 12
  },
  button: {
    paddingVertical: 6
  },
  footer: {
    padding: 32,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af'
  }
});

export default ProfileScreen;