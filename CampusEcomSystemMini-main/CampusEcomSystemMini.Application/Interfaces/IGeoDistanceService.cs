namespace CampusEcomSystemMini.Application.Interfaces;

public interface IGeoDistanceService
{
    double CalculateDistanceMeters(double lat1, double lng1, double lat2, double lng2);
}