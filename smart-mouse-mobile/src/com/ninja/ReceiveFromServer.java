package com.ninja;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;


public class ReceiveFromServer {

	private DatagramSocket serverSocket;

	public ReceiveFromServer() {
		try {
			try {
				serverSocket = new DatagramSocket(Parameters.ANDROID_UDP_LISTENER_PORT,
						InetAddress.getByName(Parameters.ANDROID_UDP_SERVER_ADDRESS));
			} catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println("Server started on port : " + Parameters.ANDROID_UDP_LISTENER_PORT);
		} catch (SocketException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	protected void onPostExecute(String result) {
		/* do nothing */
	}

	protected String doInBackground(String... params) {
		byte[] _receiveData = new byte[Parameters.UDP_PACKET_BUFFER_SIZE];
		while (true) {
			DatagramPacket receivePacket = new DatagramPacket(_receiveData,
					_receiveData.length);
			try {
				serverSocket.receive(receivePacket);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			String data = new String(receivePacket.getData());
			
			
			for (int i = 0; i < Parameters.UDP_PACKET_BUFFER_SIZE; i++) {
				_receiveData[i] = (byte) (0);
			}
		}
	}

}
