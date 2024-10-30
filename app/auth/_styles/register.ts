import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingTop: "50%",
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  forgotPassword: {
    color: 'red',
    textAlign: 'right',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccount: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  continueWith: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 5,
    padding: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});