package fakanal.android;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import fakanal.android.network.ServerAPI;
import fakanal.android.network.ServerAPIBuilder;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements Callback<Void> {
    private static final String TAG = MainActivity.class.getName();
    public static ServerAPI API;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Address is hardcoded for now, later may be injected.
        String serverAddress = "1.2.3.4";

        API = new ServerAPIBuilder(serverAddress).build();
        Call<Void> helloWorldApiCall = API.helloWorldCall("Hello World message to the server");
        helloWorldApiCall.enqueue(this);

        setContentView(R.layout.activity_main);
    }

    @Override
    public void onResponse(Call<Void> helloWorldApiCall, Response<Void> response) {
        if (response.isSuccessful()) {
            Log.i(TAG, "Successfully got answer from the server, response: " + response.code());
        } else {
            Log.e(TAG, "Failed to get a success answer from the server, response: " + response.code());
        }
    }

    @Override
    public void onFailure(Call<Void> helloWorldApiCall, Throwable t) {
        Log.e(TAG, "Failed to get answer from the server", t);
    }
}
