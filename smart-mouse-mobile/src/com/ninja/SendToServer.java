package com.ninja;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

import android.os.AsyncTask;

public class SendToServer extends AsyncTask<String, Void, String> {

	private byte[] buf;
	private DatagramSocket socket;
	private InetAddress serverAddr = null;
	private int port;

	public SendToServer(int port) {
		this.port = port;
		buf = null;
		try {
			socket = new DatagramSocket();
		} catch (SocketException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			serverAddr = InetAddress.getByName(Parameters.SERVER_ADDRESS);
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	protected void onPostExecute(String result) {
		/* do nothing */
	}

	protected String doInBackground(String... params) {
		buf = (params[0]).getBytes();
		DatagramPacket packet = new DatagramPacket(buf, buf.length, serverAddr,
				this.port);
		try {
			if (socket != null) {
				socket.send(packet);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// socket.close();
		// Log.v("Message", "Finished Background Process");
		return null;
	}
}
