package fakanal.android;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import java.io.IOException;

import fakanal.android.network.ServerAPI;
import fakanal.android.network.ServerAPIBuilder;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements Callback<ResponseBody> {
    private static final String TAG = MainActivity.class.getName();
    public static ServerAPI API;

    private Button sendButton;
    private EditText editText;
    private TextView textView;

    // Address is hardcoded for now, later may be injected.
    private String serverAddress = "35.156.26.234";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final Callback<ResponseBody> thiz = this;

        setContentView(R.layout.activity_main);

        sendButton = (Button) findViewById(R.id.button);
        editText = (EditText) findViewById(R.id.editText);
        textView = (TextView) findViewById(R.id.textView);

        // Simple click listener
        sendButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String message = String.valueOf(editText.getText());
                Log.i(TAG, "Sending request to server with message: " + message);

                API = new ServerAPIBuilder(serverAddress).build();
                Call<ResponseBody> helloWorldApiCall = API.helloWorldCall(message);
                helloWorldApiCall.enqueue(thiz);
            }
        });
    }

    @Override
    public void onResponse(Call<ResponseBody> helloWorldApiCall, Response<ResponseBody> response) {
        if (response.isSuccessful()) {
            Log.i(TAG, "Successfully got answer from the server, response: " + response);
            try {
                textView.setText(response.body().string());
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            Log.e(TAG, "Failed to get a success answer from the server, response: " + response.code());
            textView.setText(":(");
        }
    }

    @Override
    public void onFailure(Call<ResponseBody> helloWorldApiCall, Throwable t) {
        Log.e(TAG, "Failed to get answer from the server", t);
        textView.setText(":((");
    }
}
