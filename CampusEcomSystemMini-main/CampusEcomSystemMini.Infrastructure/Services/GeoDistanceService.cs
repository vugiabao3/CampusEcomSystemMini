using CampusEcomSystemMini.Application.Interfaces;

namespace CampusEcomSystemMini.Infrastructure.Services;

public class GeoDistanceService : IGeoDistanceService
{
    private const double EarthRadiusMeters = 6371000d;

    public double CalculateDistanceMeters(double lat1, double lng1, double lat2, double lng2)
    {
        var latitude1 = lat1 * Math.PI / 180d;
        var latitude2 = lat2 * Math.PI / 180d;

        var deltaLatitude = (lat2 - lat1) * Math.PI / 180d;
        var deltaLongitude = (lng2 - lng1) * Math.PI / 180d;

        var a = Math.Sin(deltaLatitude / 2d) * Math.Sin(deltaLatitude / 2d) +
                Math.Cos(latitude1) * Math.Cos(latitude2) *
                Math.Sin(deltaLongitude / 2d) * Math.Sin(deltaLongitude / 2d);

        a = Math.Clamp(a, 0d, 1d);

        var c = 2d * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1d - a));

        return EarthRadiusMeters * c;
    }
}