package fakanal.android.network;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.concurrent.TimeUnit;

import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ServerAPIBuilder {

    private final GsonBuilder gsonBuilder;
    private final OkHttpClient.Builder httpClientBuilder;

    private final String protocol;
    private final String serverUrl;
    private final String port;

    public ServerAPIBuilder(String serverAddress) {
        this.gsonBuilder = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");

        this.httpClientBuilder = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .connectionPool(new ConnectionPool(5, 1, TimeUnit.DAYS));

        this.protocol = "http://";
        this.serverUrl = serverAddress;
        this.port = "8080";
    }

    public ServerAPI build() {

        Gson gson = gsonBuilder.create();
        OkHttpClient httpClient = httpClientBuilder.build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(protocol + serverUrl + ":" + port)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .client(httpClient)
                .build();

        return retrofit.create(ServerAPI.class);
    }
}
