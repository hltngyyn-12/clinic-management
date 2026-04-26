import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class TempBcrypt {
  public static void main(String[] args) {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    System.out.println("123456=" + encoder.encode("123456"));
    System.out.println("doctor123=" + encoder.encode("doctor123"));
    System.out.println("patient123=" + encoder.encode("patient123"));
  }
}
