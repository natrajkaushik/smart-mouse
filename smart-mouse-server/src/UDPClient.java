

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

public class UDPClient {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		InetAddress IPAddress = null;
		try {
			IPAddress = InetAddress.getByName("143.215.51.151");
			System.out.println(IPAddress.getHostName());
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		byte[] sendData = new byte[1024];
		sendData = "CLICK".getBytes();
		DatagramSocket clientSocket = null;
		try {
			clientSocket = new DatagramSocket();
		} catch (SocketException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		DatagramPacket sendPacket = new DatagramPacket(sendData,
				sendData.length, IPAddress, 7132);
		try {
			clientSocket.send(sendPacket);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		clientSocket.close();

	}

}
